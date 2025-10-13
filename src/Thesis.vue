<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useThesisQuery, type Thesis, useSupabase } from '@y2kfund/core'
import { useQueryClient } from '@tanstack/vue-query'
import type { ThesisProps } from './index'

const props = withDefaults(defineProps<ThesisProps>(), {
  userId: null,
  showHeaderLink: false
})

const emit = defineEmits<{ 
  'minimize': []
  'navigate': []
}>()

// Query thesis data
const thesisQuery = useThesisQuery()
const supabase = useSupabase()
const queryClient = useQueryClient()

// Get current user email/name
const currentUserEmail = ref<string>('')

// Fetch current user's email on mount
async function fetchCurrentUser() {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (user?.email) {
      currentUserEmail.value = user.email
    } else if (user?.user_metadata?.name) {
      currentUserEmail.value = user.user_metadata.name
    } else if (props.userId) {
      currentUserEmail.value = props.userId
    }
  } catch (error) {
    console.error('Error fetching current user:', error)
    if (props.userId) {
      currentUserEmail.value = props.userId
    }
  }
}

// Call on component mount
fetchCurrentUser()

// Stock data type
interface ThesisStock {
  id: string
  thesis_id: string
  symbol: string
  pe_ratio: number | null
  peg_ratio: number | null
  passed_checks: boolean
  currently_held: boolean
  pe_ratio_updated_by?: string
  pe_ratio_updated_at?: string
  peg_ratio_updated_by?: string
  peg_ratio_updated_at?: string
  passed_checks_updated_by?: string
  passed_checks_updated_at?: string
  currently_held_updated_by?: string
  currently_held_updated_at?: string
  created_at?: string
  updated_at?: string
}

// Stock management state
const thesisStocks = ref<Record<string, ThesisStock[]>>({})
const editingCell = ref<{ thesisId: string; stockId: string; field: string } | null>(null)
const editingValue = ref<any>(null)
const showAddStockModal = ref(false)
const addStockThesisId = ref<string>('')
const newStockSymbol = ref('')
const expandedThesis = ref<Set<string>>(new Set())

// Load stocks for all thesis
async function loadThesisStocks() {
  try {
    const { data, error } = await supabase
      .schema('hf')
      .from('thesisStocks')
      .select('*')
      .order('symbol')
    
    if (error) throw error
    
    // Group stocks by thesis_id
    const grouped: Record<string, ThesisStock[]> = {}
    data?.forEach((stock: ThesisStock) => {
      if (!grouped[stock.thesis_id]) {
        grouped[stock.thesis_id] = []
      }
      grouped[stock.thesis_id].push(stock)
    })
    
    thesisStocks.value = grouped
  } catch (error: any) {
    console.error('Error loading thesis stocks:', error)
    showToast('error', 'Error', `Failed to load instruments: ${error.message}`)
  }
}

// Watch for thesis data changes to load stocks
watch(() => thesisQuery.data.value, (data) => {
  if (data && data.length > 0) {
    loadThesisStocks()
  }
}, { immediate: true })

// Toggle thesis expansion
function toggleThesis(thesisId: string) {
  if (expandedThesis.value.has(thesisId)) {
    expandedThesis.value.delete(thesisId)
  } else {
    expandedThesis.value.add(thesisId)
  }
}

// Add stock modal
function showAddStockModalForThesis(thesisId: string) {
  addStockThesisId.value = thesisId
  newStockSymbol.value = ''
  showAddStockModal.value = true
}

async function addStockToThesis() {
  if (!newStockSymbol.value.trim() || !addStockThesisId.value) return
  
  try {
    const { data, error } = await supabase
      .schema('hf')
      .from('thesisStocks')
      .insert([{
        thesis_id: addStockThesisId.value,
        symbol: newStockSymbol.value.trim().toUpperCase(),
        pe_ratio: null,
        peg_ratio: null,
        passed_checks: false,
        currently_held: false
      }])
      .select()
    
    if (error) throw error
    
    // Reload stocks
    await loadThesisStocks()
    
    // Reset and close
    newStockSymbol.value = ''
    showAddStockModal.value = false
    
    showToast('success', 'Instrument Added', `${newStockSymbol.value} has been added to the thesis`)
  } catch (error: any) {
    console.error('Error adding stock:', error)
    showToast('error', 'Error', `Failed to add stock: ${error.message}`)
  }
}

async function deleteStock(thesisId: string, stockId: string, symbol: string) {
  if (!confirm(`Are you sure you want to remove ${symbol} from this thesis?`)) return
  
  try {
    const { error } = await supabase
      .schema('hf')
      .from('thesisStocks')
      .delete()
      .eq('id', stockId)
    
    if (error) throw error
    
    // Reload stocks
    await loadThesisStocks()
    
    showToast('success', 'Instrument Removed', `${symbol} has been removed from the thesis`)
  } catch (error: any) {
    console.error('Error deleting stock:', error)
    showToast('error', 'Error', `Failed to remove stock: ${error.message}`)
  }
}

// Cell editing
function startEditCell(thesisId: string, stock: ThesisStock, field: 'pe_ratio' | 'peg_ratio' | 'passed_checks' | 'currently_held') {
  editingCell.value = { thesisId, stockId: stock.id, field }
  editingValue.value = stock[field]
}

function cancelEdit() {
  editingCell.value = null
  editingValue.value = null
}

async function saveEdit(stock: ThesisStock, field: 'pe_ratio' | 'peg_ratio' | 'passed_checks' | 'currently_held') {
  if (!editingCell.value) return
  
  // Check if we have user email
  if (!currentUserEmail.value) {
    showToast('error', 'Error', 'User information not available')
    cancelEdit()
    return
  }
  
  try {
    const updateData: any = {
      [field]: editingValue.value,
      [`${field}_updated_by`]: currentUserEmail.value,
      [`${field}_updated_at`]: new Date().toISOString()
    }
    
    const { error } = await supabase
      .schema('hf')
      .from('thesisStocks')
      .update(updateData)
      .eq('id', stock.id)
    
    if (error) throw error
    
    // Reload stocks
    await loadThesisStocks()
    
    cancelEdit()
    showToast('success', 'Updated', `${field.replace('_', ' ')} has been updated`)
  } catch (error: any) {
    console.error('Error updating stock:', error)
    showToast('error', 'Error', `Failed to update: ${error.message}`)
  }
}

// Get cell metadata for tooltip
function getCellMetadata(stock: ThesisStock, field: string): string {
  const updatedBy = stock[`${field}_updated_by` as keyof ThesisStock]
  const updatedAt = stock[`${field}_updated_at` as keyof ThesisStock]
  
  if (updatedBy && updatedAt) {
    const date = new Date(updatedAt as string).toLocaleString()
    return `Updated by: ${updatedBy}\nUpdated at: ${date}`
  }
  
  return 'No updates yet'
}

// Modal state
const showThesisModal = ref(false)
const thesisModalMode = ref<'add' | 'edit'>('add')
const newThesis = ref({ title: '', description: '' })
const editThesisForm = ref({ id: '', title: '', description: '' })

// Computed properties for form bindings
const modalTitle = computed({
  get: () => thesisModalMode.value === 'add' ? newThesis.value.title : editThesisForm.value.title,
  set: (value) => {
    if (thesisModalMode.value === 'add') {
      newThesis.value.title = value
    } else {
      editThesisForm.value.title = value
    }
  }
})

const modalDescription = computed({
  get: () => thesisModalMode.value === 'add' ? newThesis.value.description : editThesisForm.value.description,
  set: (value) => {
    if (thesisModalMode.value === 'add') {
      newThesis.value.description = value
    } else {
      editThesisForm.value.description = value
    }
  }
})

// Toast notification system
type ToastType = 'success' | 'error' | 'warning' | 'info'
interface Toast {
  id: number
  type: ToastType
  title: string
  message?: string
}

const toasts = ref<Toast[]>([])
let toastIdCounter = 0

function showToast(type: ToastType, title: string, message?: string) {
  const id = toastIdCounter++
  toasts.value.push({ id, type, title, message })
  
  setTimeout(() => {
    removeToast(id)
  }, 5000)
}

function removeToast(id: number) {
  const index = toasts.value.findIndex(t => t.id === id)
  if (index !== -1) {
    toasts.value.splice(index, 1)
  }
}

// Thesis management functions
function showThesisModalForAdd() {
  thesisModalMode.value = 'add'
  newThesis.value = { title: '', description: '' }
  showThesisModal.value = true
}

async function addNewThesis() {
  if (!newThesis.value.title.trim()) return
  
  try {
    const { data, error } = await supabase
      .schema('hf')
      .from('thesisMaster')
      .insert([{
        title: newThesis.value.title.trim(),
        description: newThesis.value.description.trim() || null
      }])
      .select()
    
    if (error) throw error
    
    // Refresh thesis data
    queryClient.invalidateQueries({ queryKey: ['thesis'] })
    
    // Reset form and close modal
    newThesis.value = { title: '', description: '' }
    showThesisModal.value = false
    
    showToast('success', 'Thesis Added', 'New thesis has been created successfully')
  } catch (error: any) {
    console.error('Error adding thesis:', error)
    showToast('error', 'Error', `Failed to add thesis: ${error.message}`)
  }
}

function startEditThesis(thesis: Thesis) {
  editThesisForm.value = {
    id: thesis.id,
    title: thesis.title,
    description: thesis.description || ''
  }
  thesisModalMode.value = 'edit'
  showThesisModal.value = true
}

function cancelThesisEdit() {
  editThesisForm.value = { id: '', title: '', description: '' }
  showThesisModal.value = false
}

async function saveEditThesis() {
  if (!editThesisForm.value.title.trim()) return
  
  try {
    const { error } = await supabase
      .schema('hf')
      .from('thesisMaster')
      .update({
        title: editThesisForm.value.title.trim(),
        description: editThesisForm.value.description.trim() || null
      })
      .eq('id', editThesisForm.value.id)
    
    if (error) throw error
    
    // Refresh thesis data
    queryClient.invalidateQueries({ queryKey: ['thesis'] })
    
    // Reset form and close modal
    editThesisForm.value = { id: '', title: '', description: '' }
    showThesisModal.value = false
    
    showToast('success', 'Thesis Updated', 'Thesis has been updated successfully')
  } catch (error: any) {
    console.error('Error updating thesis:', error)
    showToast('error', 'Error', `Failed to update thesis: ${error.message}`)
  }
}

async function deleteThesis(id: string, title: string) {
  if (!confirm(`Are you sure you want to delete thesis "${title}"?\n\nNote: This will also delete all instruments associated with this thesis.`)) return
  
  try {
    // Delete associated stocks first
    await supabase
      .schema('hf')
      .from('thesisStocks')
      .delete()
      .eq('thesis_id', id)
    
    // Delete thesis
    const { error } = await supabase
      .schema('hf')
      .from('thesisMaster')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    
    // Refresh thesis data and stocks
    queryClient.invalidateQueries({ queryKey: ['thesis'] })
    await loadThesisStocks()
    
    showToast('success', 'Thesis Deleted', 'Thesis and associated instruments have been deleted successfully')
  } catch (error: any) {
    console.error('Error deleting thesis:', error)
    showToast('error', 'Error', `Failed to delete thesis: ${error.message}`)
  }
}
</script>

<template>
  <div class="thesis-card">
    <!-- Loading state -->
    <div v-if="thesisQuery.isLoading.value" class="loading">
      <div class="loading-spinner"></div>
      Loading thesis...
    </div>
    
    <!-- Error state -->
    <div v-else-if="thesisQuery.isError.value" class="error">
      <h3>Error loading thesis</h3>
      <p>{{ thesisQuery.error.value }}</p>
    </div>
    
    <!-- Success state -->
    <div v-else-if="thesisQuery.isSuccess.value" class="thesis-container">
      <div class="thesis-header">
        <h2 
          :class="{ 'thesis-header-clickable': props.showHeaderLink }"
          @click="props.showHeaderLink && emit('navigate')"
        >
          Thesis Management
        </h2>
        <div class="thesis-header-actions">
          <button class="btn btn-primary" @click="showThesisModalForAdd">
            <span class="icon">➕</span> Add New Thesis
          </button>
          <button 
            class="btn btn-minimize" 
            @click="emit('minimize')"
            title="Minimize"
          >
            ➖
          </button>
        </div>
      </div>
      
      <div class="thesis-list">
        <div v-if="!thesisQuery.data.value || thesisQuery.data.value.length === 0" class="thesis-empty">
          <p>No thesis found. Click "Add New Thesis" to create one.</p>
        </div>
        
        <div v-else class="thesis-items">
          <div 
            v-for="thesis in thesisQuery.data.value" 
            :key="thesis.id" 
            class="thesis-item-wrapper"
          >
            <div class="thesis-item">
              <div class="thesis-content" @click="toggleThesis(thesis.id)">
                <div class="thesis-expand-icon">
                  {{ expandedThesis.has(thesis.id) ? '▼' : '▶' }}
                </div>
                <div class="thesis-info">
                  <div class="thesis-title">{{ thesis.title }}</div>
                  <div v-if="thesis.description" class="thesis-description">
                    {{ thesis.description }}
                  </div>
                  <div class="thesis-meta">
                    <span v-if="thesis.created_at" class="thesis-date">
                      Created: {{ new Date(thesis.created_at).toLocaleDateString() }}
                    </span>
                    <span class="thesis-stock-count">
                      {{ thesisStocks[thesis.id]?.length || 0 }} instruments
                    </span>
                  </div>
                </div>
              </div>
              <div class="thesis-actions">
                <button 
                  class="btn btn-secondary btn-sm" 
                  @click="startEditThesis(thesis)"
                  title="Edit thesis"
                >
                  ✏️ Edit
                </button>
                <button 
                  class="btn btn-danger btn-sm" 
                  @click="deleteThesis(thesis.id, thesis.title)"
                  title="Delete thesis"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>

            <!-- Stock table for expanded thesis -->
            <div v-if="expandedThesis.has(thesis.id)" class="stocks-section">
              <div class="stocks-header">
                <h4>Instruments</h4>
                <button 
                  class="btn btn-primary btn-sm" 
                  @click="showAddStockModalForThesis(thesis.id)"
                >
                  ➕ Add Instrument
                </button>
              </div>

              <div v-if="!thesisStocks[thesis.id] || thesisStocks[thesis.id].length === 0" class="stocks-empty">
                No instruments added yet. Click "Add Instrument" to add one.
              </div>

              <div v-else class="stocks-table-wrapper">
                <table class="stocks-table">
                  <thead>
                    <tr>
                      <th>Symbol</th>
                      <th>PE Ratio</th>
                      <th>PEG Ratio</th>
                      <th>Passed checks to hold in portfolio</th>
                      <th>Currently held in portfolio</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="stock in thesisStocks[thesis.id]" :key="stock.id">
                      <td class="stock-symbol">{{ stock.symbol }}</td>
                      
                      <!-- PE Ratio Cell -->
                      <td 
                        class="editable-cell"
                        :title="getCellMetadata(stock, 'pe_ratio')"
                        @dblclick="startEditCell(thesis.id, stock, 'pe_ratio')"
                      >
                        <input
                          v-if="editingCell?.stockId === stock.id && editingCell?.field === 'pe_ratio'"
                          v-model.number="editingValue"
                          type="number"
                          step="0.01"
                          @blur="saveEdit(stock, 'pe_ratio')"
                          @keyup.enter="saveEdit(stock, 'pe_ratio')"
                          @keyup.escape="cancelEdit"
                          autofocus
                        />
                        <span v-else>{{ stock.pe_ratio ?? '-' }}</span>
                      </td>
                      
                      <!-- PEG Ratio Cell -->
                      <td 
                        class="editable-cell"
                        :title="getCellMetadata(stock, 'peg_ratio')"
                        @dblclick="startEditCell(thesis.id, stock, 'peg_ratio')"
                      >
                        <input
                          v-if="editingCell?.stockId === stock.id && editingCell?.field === 'peg_ratio'"
                          v-model.number="editingValue"
                          type="number"
                          step="0.01"
                          @blur="saveEdit(stock, 'peg_ratio')"
                          @keyup.enter="saveEdit(stock, 'peg_ratio')"
                          @keyup.escape="cancelEdit"
                          autofocus
                        />
                        <span v-else>{{ stock.peg_ratio ?? '-' }}</span>
                      </td>
                      
                      <!-- Passed Checks Cell -->
                      <td 
                        class="editable-cell checkbox-cell"
                        :title="getCellMetadata(stock, 'passed_checks')"
                        @dblclick="startEditCell(thesis.id, stock, 'passed_checks')"
                      >
                        <input
                          v-if="editingCell?.stockId === stock.id && editingCell?.field === 'passed_checks'"
                          v-model="editingValue"
                          type="checkbox"
                          @blur="saveEdit(stock, 'passed_checks')"
                          @keyup.enter="saveEdit(stock, 'passed_checks')"
                          @keyup.escape="cancelEdit"
                          autofocus
                        />
                        <span v-else>{{ stock.passed_checks ? '✅' : '❌' }}</span>
                      </td>
                      
                      <!-- Currently Held Cell -->
                      <td 
                        class="editable-cell checkbox-cell"
                        :title="getCellMetadata(stock, 'currently_held')"
                        @dblclick="startEditCell(thesis.id, stock, 'currently_held')"
                      >
                        <input
                          v-if="editingCell?.stockId === stock.id && editingCell?.field === 'currently_held'"
                          v-model="editingValue"
                          type="checkbox"
                          @blur="saveEdit(stock, 'currently_held')"
                          @keyup.enter="saveEdit(stock, 'currently_held')"
                          @keyup.escape="cancelEdit"
                          autofocus
                        />
                        <span v-else>{{ stock.currently_held ? '✅' : '❌' }}</span>
                      </td>
                      
                      <td class="stock-actions">
                        <button 
                          class="btn btn-danger btn-xs" 
                          @click="deleteStock(thesis.id, stock.id, stock.symbol)"
                          title="Remove stock"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Thesis Modal (Add/Edit) -->
    <div v-if="showThesisModal" class="modal-overlay" @click="showThesisModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ thesisModalMode === 'add' ? 'Add New Thesis' : 'Edit Thesis' }}</h3>
          <button class="modal-close" @click="showThesisModal = false">×</button>
        </div>
        
        <div class="modal-body">
          <div class="form-group">
            <label :for="thesisModalMode === 'add' ? 'thesis-title' : 'edit-thesis-title'">
              Title *
            </label>
            <input 
              :id="thesisModalMode === 'add' ? 'thesis-title' : 'edit-thesis-title'"
              v-model="modalTitle"
              type="text" 
              placeholder="Enter thesis title"
              maxlength="100"
              autofocus
            />
          </div>
          <div class="form-group">
            <label :for="thesisModalMode === 'add' ? 'thesis-description' : 'edit-thesis-description'">
              Description
            </label>
            <textarea 
              :id="thesisModalMode === 'add' ? 'thesis-description' : 'edit-thesis-description'"
              v-model="modalDescription"
              placeholder="Enter thesis description (optional)"
              rows="4"
              maxlength="500"
            ></textarea>
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="btn btn-cancel" @click="thesisModalMode === 'edit' ? cancelThesisEdit() : (showThesisModal = false)">
            Cancel
          </button>
          <button 
            class="btn btn-primary" 
            @click="thesisModalMode === 'add' ? addNewThesis() : saveEditThesis()"
            :disabled="!modalTitle.trim()"
          >
            {{ thesisModalMode === 'add' ? 'Add Thesis' : 'Save Changes' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Add Stock Modal -->
    <div v-if="showAddStockModal" class="modal-overlay" @click="showAddStockModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Add Instrument to Thesis</h3>
          <button class="modal-close" @click="showAddStockModal = false">×</button>
        </div>
        
        <div class="modal-body">
          <div class="form-group">
            <label for="stock-symbol">Instrument Symbol *</label>
            <input 
              id="stock-symbol"
              v-model="newStockSymbol"
              type="text" 
              placeholder="Enter instrument symbol (e.g., AAPL)"
              maxlength="10"
              autofocus
              @keyup.enter="addStockToThesis"
            />
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="btn btn-cancel" @click="showAddStockModal = false">
            Cancel
          </button>
          <button 
            class="btn btn-primary" 
            @click="addStockToThesis"
            :disabled="!newStockSymbol.trim()"
          >
            Add Instrument
          </button>
        </div>
      </div>
    </div>

    <!-- Toast Container -->
    <div class="toast-container">
      <TransitionGroup name="toast" tag="div">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="['toast', `toast-${toast.type}`]"
          @click="removeToast(toast.id)"
        >
          <div class="toast-icon">
            <span v-if="toast.type === 'success'">✅</span>
            <span v-else-if="toast.type === 'error'">❌</span>
            <span v-else-if="toast.type === 'warning'">⚠️</span>
            <span v-else-if="toast.type === 'info'">ℹ️</span>
          </div>
          <div class="toast-content">
            <div class="toast-title">{{ toast.title }}</div>
            <div v-if="toast.message" class="toast-message">{{ toast.message }}</div>
          </div>
          <button class="toast-close" @click.stop="removeToast(toast.id)" aria-label="Close notification">
            ×
          </button>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<style scoped>
.thesis-card {
  padding: 0.75rem;
  border-radius: 0.75rem;
  border: 1px solid rgba(0,0,0,.1);
  box-shadow: 0 4px 12px rgba(0,0,0,.1);
  background: white;
}

.loading, .error {
  padding: 2rem;
  text-align: center;
  border-radius: 0.5rem;
  margin: 1rem 0;
}

.loading {
  background-color: #f8f9fa;
  color: #6c757d;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.loading-spinner {
  width: 2rem;
  height: 2rem;
  border: 3px solid #e9ecef;
  border-top: 3px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.error h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.125rem;
}

.error p {
  margin: 0;
  font-family: monospace;
  font-size: 0.875rem;
}

.thesis-container {
  width: 100%;
}

.thesis-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #dee2e6;
}

.thesis-header h2 {
  margin: 0;
  font-size: 1.35rem;
  font-weight: 600;
  color: #333;
}

.thesis-header-clickable {
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: color 0.2s ease;
}

.thesis-header-clickable:hover {
  color: #007bff;
}

.header-link-icon {
  font-size: 1.25rem;
  transition: transform 0.2s ease;
}

.thesis-header-clickable:hover .header-link-icon {
  transform: translateX(4px);
}

.thesis-header-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.btn-minimize {
  background: #fff;
  border-color: #6c757d;
  padding: 0.5rem 0.75rem !important;
  width: auto;
}

.btn-minimize:hover {
  background: #545b62;
  border-color: #4e555b;
}

.thesis-list {
  width: 100%;
}

.thesis-empty {
  padding: 3rem 1rem;
  text-align: center;
  color: #6c757d;
}

.thesis-empty p {
  margin: 0;
  font-size: 1rem;
}

.thesis-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/*.thesis-item-wrapper {
  margin-bottom: 1rem;
}*/

.thesis-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 0.75rem;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  background: #f8f9fa;
  transition: all 0.2s ease;
}

.thesis-item:hover {
  background: #e9ecef;
  border-color: #adb5bd;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.thesis-content {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  cursor: pointer;
  user-select: none;
}

.thesis-expand-icon {
  font-size: 0.875rem;
  color: #6c757d;
  min-width: 1rem;
  padding-top: 0.125rem;
}

.thesis-info {
  flex: 1;
  min-width: 0;
}

.thesis-title {
  font-weight: 600;
  font-size: 1rem;
  color: #333;
  margin-bottom: 0.25rem;
}

.thesis-description {
  color: #6c757d;
  font-size: 0.9375rem;
  line-height: 1.5;
  margin-bottom: 0.75rem;
}

.thesis-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.8125rem;
  color: #868e96;
}

.thesis-stock-count {
  margin-left: 1rem;
  color: #007bff;
  font-weight: 500;
}

.thesis-actions {
  display: flex;
  gap: 0.5rem;
  margin-left: 1rem;
  flex-shrink: 0;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 1rem;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.btn-primary {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.btn-primary:hover:not(:disabled) {
  background: #0056b3;
  border-color: #0056b3;
}

.btn-primary:disabled {
  background: #6c757d;
  border-color: #6c757d;
  cursor: not-allowed;
  opacity: 0.6;
}

.btn-secondary {
  background: #6c757d;
  color: white;
  border-color: #6c757d;
}

.btn-secondary:hover {
  background: #545b62;
  border-color: #4e555b;
}

.btn-danger {
  background: #dc3545;
  color: white;
  border-color: #dc3545;
}

.btn-danger:hover {
  background: #c82333;
  border-color: #bd2130;
}

.btn-cancel {
  background: white;
  color: #6c757d;
}

.btn-cancel:hover {
  background: #f8f9fa;
}

.btn-sm {
  padding: 0.375rem 0.75rem;
  font-size: 0.8125rem;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.modal-header {
  padding: 1.25rem;
  border-bottom: 1px solid #dee2e6;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #333;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6c757d;
  padding: 0;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background: #f8f9fa;
  color: #333;
}

.modal-body {
  padding: 1.25rem;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  font-size: 0.875rem;
  color: #333;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.625rem 0.875rem;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  font-size: 0.9375rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.form-group textarea {
  resize: vertical;
  font-family: inherit;
}

.modal-footer {
  padding: 1.25rem;
  border-top: 1px solid #dee2e6;
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}

/* Toast notification styles */
.toast-container {
  position: fixed;
  top: 1.25rem;
  right: 1.25rem;
  z-index: 10000;
  pointer-events: none;
  max-width: 400px;
}

.toast {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  margin-bottom: 0.75rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  pointer-events: auto;
  min-width: 300px;
  position: relative;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.toast-success {
  background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
  color: #155724;
  border-left: 4px solid #28a745;
}

.toast-error {
  background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%);
  color: #721c24;
  border-left: 4px solid #dc3545;
}

.toast-warning {
  background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
  color: #856404;
  border-left: 4px solid #ffc107;
}

.toast-info {
  background: linear-gradient(135deg, #d1ecf1 0%, #bee5eb 100%);
  color: #0c5460;
  border-left: 4px solid #17a2b8;
}

.toast-icon {
  font-size: 1.25rem;
  flex-shrink: 0;
  line-height: 1;
}

.toast-content {
  flex: 1;
  min-width: 0;
}

.toast-title {
  font-weight: 600;
  font-size: 0.875rem;
  line-height: 1.3;
  margin-bottom: 0.25rem;
}

.toast-message {
  font-size: 0.8125rem;
  line-height: 1.4;
  opacity: 0.9;
}

.toast-close {
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  color: inherit;
  opacity: 0.6;
  padding: 0;
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.toast-close:hover {
  opacity: 1;
  background: rgba(0, 0, 0, 0.1);
}

/* Toast animations */
.toast-enter-active {
  transition: all 0.3s ease-out;
}

.toast-leave-active {
  transition: all 0.3s ease-in;
}

.toast-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.toast-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.toast-move {
  transition: transform 0.3s ease;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .thesis-card {
    padding: 0.5rem;
  }
  
  .thesis-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .thesis-item {
    flex-direction: column;
  }
  
  .thesis-actions {
    margin-left: 0;
    margin-top: 1rem;
    width: 100%;
  }
}

@media (max-width: 480px) {
  .toast-container {
    left: 0.625rem;
    right: 0.625rem;
    top: 0.625rem;
    max-width: none;
  }
  
  .toast {
    min-width: auto;
  }
}

/* Stocks section */
.stocks-section {
  margin-top: 1rem;
  padding: 0.75rem 1rem;
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  width: calc(100% - 4rem);
  margin-left: 2rem;
}

.stocks-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.stocks-header h4 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #333;
}

.stocks-empty {
  padding: 2rem;
  text-align: center;
  color: #6c757d;
  font-size: 0.875rem;
}

/* Stocks table */
.stocks-table-wrapper {
  overflow-x: auto;
}

.stocks-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.stocks-table thead {
  background: #f8f9fa;
}

.stocks-table th {
  padding: 0.5rem;
  text-align: left;
  font-weight: 600;
  color: #495057;
  border-bottom: 2px solid #dee2e6;
}

/* Center align all headers except Symbol */
.stocks-table th:not(:first-child) {
  text-align: center;
}

.stocks-table td {
  padding: 0.35rem;
  border-bottom: 1px solid #e9ecef;
}

.stocks-table td button {
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  width: auto;
}

.thesis-card button {
    width: auto;
    padding: 0.4rem 0.75rem !important;
}

/* Center align all cells except Symbol */
.stocks-table td:not(:first-child) {
  text-align: center;
}

.stocks-table tbody tr:hover {
  background: #f8f9fa;
}

.stock-symbol {
  font-weight: 600;
  color: #007bff;
  text-align: left;
}

.editable-cell {
  cursor: pointer;
  position: relative;
}

.editable-cell:hover {
  background: #e9ecef;
}

.editable-cell input[type="number"] {
  width: 100%;
  padding: 0.375rem;
  border: 1px solid #007bff;
  border-radius: 4px;
  font-size: 0.875rem;
  text-align: center;
}

.checkbox-cell {
  text-align: center;
}

.checkbox-cell input[type="checkbox"] {
  width: auto;
  cursor: pointer;
}

.stock-actions {
  text-align: center;
  width: 80px;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.modal-header {
  padding: 1.25rem;
  border-bottom: 1px solid #dee2e6;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #333;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6c757d;
  padding: 0;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background: #f8f9fa;
  color: #333;
}

.modal-body {
  padding: 1.25rem;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  font-size: 0.875rem;
  color: #333;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.625rem 0.875rem;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  font-size: 0.9375rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.form-group textarea {
  resize: vertical;
  font-family: inherit;
}

.modal-footer {
  padding: 1.25rem;
  border-top: 1px solid #dee2e6;
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}

/* Toast notification styles */
.toast-container {
  position: fixed;
  top: 1.25rem;
  right: 1.25rem;
  z-index: 10000;
  pointer-events: none;
  max-width: 400px;
}

.toast {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  margin-bottom: 0.75rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  pointer-events: auto;
  min-width: 300px;
  position: relative;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.toast-success {
  background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
  color: #155724;
  border-left: 4px solid #28a745;
}

.toast-error {
  background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%);
  color: #721c24;
  border-left: 4px solid #dc3545;
}

.toast-warning {
  background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
  color: #856404;
  border-left: 4px solid #ffc107;
}

.toast-info {
  background: linear-gradient(135deg, #d1ecf1 0%, #bee5eb 100%);
  color: #0c5460;
  border-left: 4px solid #17a2b8;
}

.toast-icon {
  font-size: 1.25rem;
  flex-shrink: 0;
  line-height: 1;
}

.toast-content {
  flex: 1;
  min-width: 0;
}

.toast-title {
  font-weight: 600;
  font-size: 0.875rem;
  line-height: 1.3;
  margin-bottom: 0.25rem;
}

.toast-message {
  font-size: 0.8125rem;
  line-height: 1.4;
  opacity: 0.9;
}

.toast-close {
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  color: inherit;
  opacity: 0.6;
  padding: 0;
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.toast-close:hover {
  opacity: 1;
  background: rgba(0, 0, 0, 0.1);
}

/* Toast animations */
.toast-enter-active {
  transition: all 0.3s ease-out;
}

.toast-leave-active {
  transition: all 0.3s ease-in;
}

.toast-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.toast-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.toast-move {
  transition: transform 0.3s ease;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .thesis-card {
    padding: 0.5rem;
  }
  
  .thesis-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .thesis-item {
    flex-direction: column;
  }
  
  .thesis-actions {
    margin-left: 0;
    margin-top: 1rem;
    width: 100%;
  }
}

@media (max-width: 480px) {
  .toast-container {
    left: 0.625rem;
    right: 0.625rem;
    top: 0.625rem;
    max-width: none;
  }
  
  .toast {
    min-width: auto;
  }
}
</style>