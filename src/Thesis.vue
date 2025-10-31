<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useThesisQuery, type Thesis, useSupabase } from '@y2kfund/core'
import { useQueryClient } from '@tanstack/vue-query'
import type { ThesisProps } from './index'
import ThesisItem from './components/ThesisItem.vue'

const props = withDefaults(defineProps<ThesisProps>(), {
  //userId: null,
  userId: '67e578fd-2cf7-48a4-b028-a11a3f89bb9b',
  showHeaderLink: false,
  window: null
})

const emit = defineEmits<{ 
  'minimize': []
  'navigate': []
  'maximize': []
}>()

// Query thesis data
const thesisQuery = useThesisQuery()
const supabase = useSupabase()
const queryClient = useQueryClient()

// Get current user email/name
const currentUserEmail = ref<string>('')
const expandedThesis = ref<Set<string>>(new Set())

const appName = ref('Thesis Management')
const showAppNameDialog = ref(false)
const appNameInput = ref('')

const showResourceModal = ref(false)
const resourceModalStockId = ref('')
const resourceType = ref<'pdf' | 'link'>('pdf')
const resourceUrl = ref('')
const resourceFile = ref<File | null>(null)
const resourceUploading = ref(false)
const stockResources = ref<Record<string, any[]>>({})

function parseAppNameFromUrl(): string {
  const url = new URL(window.location.href)
  return url.searchParams.get(`${props.window}_thesis_app_name`) || 'Thesis Management'
}

function writeAppNameToUrl(name: string) {
  const url = new URL(window.location.href)
  if (name && name.trim() && name !== 'Thesis Management') {
    url.searchParams.set(`${props.window}_thesis_app_name`, name.trim())
  } else {
    url.searchParams.delete(`${props.window}_thesis_app_name`)
  }
  window.history.replaceState({}, '', url.toString())
}

function openAppNameDialog() {
  appNameInput.value = appName.value
  showAppNameDialog.value = true
}

async function loadStockResources() {
  const { data, error } = await supabase
    .schema('hf')
    .from('thesisStockResources')
    .select('*')
  if (error) return
  const grouped: Record<string, any[]> = {}
  data.forEach((r: any) => {
    if (!grouped[r.stock_id]) grouped[r.stock_id] = []
    grouped[r.stock_id].push(r)
  })
  stockResources.value = grouped
}

async function deleteResource(thesisId: string, stockId: string, resourceId: string, resourceName: string) {
  if (!confirm(`Are you sure you want to delete resource "${resourceName}"?`)) return
  try {
    const { error } = await supabase
      .schema('hf')
      .from('thesisStockResources')
      .delete()
      .eq('id', resourceId)
    if (error) throw error
    await loadStockResources()
    showToast('success', 'Resource Deleted', `"${resourceName}" has been deleted.`)
  } catch (error: any) {
    showToast('error', 'Error', error.message)
  }
}

async function saveResource() {
  resourceUploading.value = true
  try {
    let url = ''
    let fileName = ''
    let fileContent = null

    if (resourceType.value === 'pdf' && resourceFile.value) {
      // Upload PDF to Supabase Storage or save content
      // Example: upload to storage and get public URL
      const { data, error } = await supabase.storage
        .from('resources')
        .upload(`pdfs/${Date.now()}_${resourceFile.value.name}`, resourceFile.value)
      if (error) throw error
      url = data.path
      fileName = resourceFile.value.name
      // Optionally, read file content as ArrayBuffer or text
    } else if (resourceType.value === 'link') {
      url = resourceUrl.value.trim()
    }

    // Insert into DB
    await supabase
      .schema('hf')
      .from('thesisStockResources')
      .insert([{
        stock_id: resourceModalStockId.value,
        type: resourceType.value,
        url,
        file_name: fileName || null,
        file_content: fileContent,
        created_by: currentUserEmail.value
      }])

    showResourceModal.value = false
    await loadStockResources() // see below
    showToast('success', 'Resource Added')
  } catch (e: any) {
    showToast('error', 'Error', e.message)
  } finally {
    resourceUploading.value = false
  }
}

function openResourceModal(thesisId: string, stockId: string) {
  resourceModalStockId.value = stockId
  resourceType.value = 'pdf'
  resourceUrl.value = ''
  resourceFile.value = null
  showResourceModal.value = true
}

function saveAppName() {
  appName.value = appNameInput.value.trim() || 'Thesis Management'
  writeAppNameToUrl(appName.value)
  showAppNameDialog.value = false
}

onMounted(() => {
  appName.value = parseAppNameFromUrl()
  expandedThesis.value = parseExpandedThesisFromUrl()
  loadStockResources()

  window.addEventListener('popstate', () => {
    appName.value = parseAppNameFromUrl()
    expandedThesis.value = parseExpandedThesisFromUrl()
  })
})

watch(expandedThesis, (val) => {
  writeExpandedThesisToUrl(val)
}, { deep: true })

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
  analyst_ratings?: string        
  founder_led?: boolean    
  next_earnings_date?: string
  analyst_ratings_updated_by?: string
  analyst_ratings_updated_at?: string
  founder_led_updated_by?: string
  founder_led_updated_at?: string
  next_earnings_date_updated_by?: string
  next_earnings_date_updated_at?: string
}

// Stock management state
const thesisStocks = ref<Record<string, ThesisStock[]>>({})
const editingCell = ref<{ thesisId: string; stockId: string; field: string } | null>(null)
const editingValue = ref<any>(null)
const showAddStockModal = ref(false)
const addStockThesisId = ref<string>('')
const newStockSymbol = ref('')

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
  writeExpandedThesisToUrl(expandedThesis.value)
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
        currently_held: false,
        analyst_ratings: '',          
        founder_led: false,
        next_earnings_date: null
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
    showToast('error', 'Error', `Failed to add instrument: ${error.message}`)
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
function startEditCell(
  thesisId: string,
  stock: ThesisStock,
  field: 'pe_ratio' | 'peg_ratio' | 'passed_checks' | 'currently_held' | 'analyst_ratings' | 'founder_led' | 'next_earnings_date' // <-- add new fields
) {
  editingCell.value = { thesisId, stockId: stock.id, field }
  editingValue.value = stock[field]
}

function cancelEdit() {
  editingCell.value = null
  editingValue.value = null
}

async function saveEdit(
  stock: ThesisStock,
  field: 'pe_ratio' | 'peg_ratio' | 'passed_checks' | 'currently_held' | 'analyst_ratings' | 'founder_led' | 'next_earnings_date',
  value: any // <-- add this parameter
) {
  //console.log('saveEdit called', stock, field, value, editingCell)
  //if (!editingCell.value) return

  if (!currentUserEmail.value) {
    showToast('error', 'Error', 'User information not available')
    cancelEdit()
    return
  }

  try {
    const updateData: any = {
      [field]: value, // <-- use the value from Tabulator
      [`${field}_updated_by`]: currentUserEmail.value,
      [`${field}_updated_at`]: new Date().toISOString()
    }

    const { error } = await supabase
      .schema('hf')
      .from('thesisStocks')
      .update(updateData)
      .eq('id', stock.id)

    if (error) throw error

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
const newThesis = ref({ title: '', description: '', parent_thesis_id: null as string | null })
const editThesisForm = ref({ id: '', title: '', description: '', parent_thesis_id: null as string | null })

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

// Update parent thesis ID computed property
const modalParentThesisId = computed({
  get: () => thesisModalMode.value === 'add' ? newThesis.value.parent_thesis_id : editThesisForm.value.parent_thesis_id,
  set: (value) => {
    if (thesisModalMode.value === 'add') {
      newThesis.value.parent_thesis_id = value
    } else {
      editThesisForm.value.parent_thesis_id = value
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
  newThesis.value = { title: '', description: '', parent_thesis_id: null }
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
        description: newThesis.value.description.trim() || null,
        parent_thesis_id: newThesis.value.parent_thesis_id || null
      }])
      .select()
    
    if (error) throw error
    
    // Refresh thesis data
    queryClient.invalidateQueries({ queryKey: ['thesis'] })
    
    // Reset form and close modal
    newThesis.value = { title: '', description: '', parent_thesis_id: null }
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
    description: thesis.description || '',
    parent_thesis_id: thesis.parent_thesis_id || null
  }
  thesisModalMode.value = 'edit'
  showThesisModal.value = true
}

function cancelThesisEdit() {
  editThesisForm.value = { id: '', title: '', description: '', parent_thesis_id: null }
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
        description: editThesisForm.value.description.trim() || null,
        parent_thesis_id: editThesisForm.value.parent_thesis_id || null
      })
      .eq('id', editThesisForm.value.id)
    
    if (error) throw error
    
    // Refresh thesis data
    queryClient.invalidateQueries({ queryKey: ['thesis'] })
    
    // Reset form and close modal
    editThesisForm.value = { id: '', title: '', description: '', parent_thesis_id: null }
    showThesisModal.value = false
    
    showToast('success', 'Thesis Updated', 'Thesis has been updated successfully')
  } catch (error: any) {
    console.error('Error updating thesis:', error)
    showToast('error', 'Error', `Failed to update thesis: ${error.message}`)
  }
}

async function deleteThesis(id: string, title: string) {
  if (!confirm(`Are you sure you want to archive thesis "${title}"?\n\nNote: This will also archive all instruments associated with this thesis.`)) return
  
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
    showToast('error', 'Error', `Failed to archive thesis: ${error.message}`)
  }
}

// Helper function to get thesis hierarchy depth
function getThesisDepth(thesisId: string, depth = 0): number {
  if (depth > 10) return depth // Prevent infinite loops
  const thesis = thesisQuery.data.value?.find(t => t.id === thesisId)
  if (!thesis || !thesis.parent_thesis_id) return depth
  return getThesisDepth(thesis.parent_thesis_id, depth + 1)
}

// Helper function to check if thesis can be a parent (prevent circular references)
function canBeParent(potentialParentId: string, childId: string): boolean {
  if (potentialParentId === childId) return false
  const thesis = thesisQuery.data.value?.find(t => t.id === potentialParentId)
  if (!thesis) return true
  if (thesis.parent_thesis_id === childId) return false
  if (thesis.parent_thesis_id) {
    return canBeParent(thesis.parent_thesis_id, childId)
  }
  return true
}

// Get available parent thesis options (excluding self and descendants)
const availableParentThesis = computed(() => {
  if (!thesisQuery.data.value) return []
  
  const currentThesisId = thesisModalMode.value === 'edit' ? editThesisForm.value.id : null
  
  return thesisQuery.data.value.filter(t => {
    if (currentThesisId && !canBeParent(t.id, currentThesisId)) return false
    return true
  })
})

// Group thesis by parent/child hierarchy
const thesisHierarchy = computed(() => {
  if (!thesisQuery.data.value) return []
  
  // Get root thesis (no parent)
  const roots = thesisQuery.data.value.filter(t => !t.parent_thesis_id)
  
  function getChildren(parentId: string): Thesis[] {
    return thesisQuery.data.value?.filter(t => t.parent_thesis_id === parentId) || []
  }
  
  function buildTree(thesis: Thesis): any {
    const children = getChildren(thesis.id)
    return {
      ...thesis,
      children: children.map(child => buildTree(child))
    }
  }
  
  return roots.map(root => buildTree(root))
})

// Get parent thesis name
function getParentThesisName(parentId: string | null | undefined): string {
  if (!parentId) return 'None'
  const parent = thesisQuery.data.value?.find(t => t.id === parentId)
  return parent?.title || 'Unknown'
}

// Add handler for updating editing value
function updateEditingValue(value: any) {
  editingValue.value = value
}

function parseExpandedThesisFromUrl(): Set<string> {
  const url = new URL(window.location.href)
  const param = url.searchParams.get(`${props.window}_expanded_thesis`)
  if (!param) return new Set()
  return new Set(param.split(',').filter(Boolean))
}

function writeExpandedThesisToUrl(expanded: Set<string>) {
  const url = new URL(window.location.href)
  if (expanded.size > 0) {
    url.searchParams.set(`${props.window}_expanded_thesis`, Array.from(expanded).join(','))
  } else {
    url.searchParams.delete(`${props.window}_expanded_thesis`)
  }
  window.history.replaceState({}, '', url.toString())
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
        <h2>
          <span :class="{ 'thesis-header-clickable': props.showHeaderLink }" @click="props.showHeaderLink && emit('navigate')">{{ appName }}</span>
          <button
            class="appname-rename-btn"
            @click="openAppNameDialog"
            title="Rename app"
            style="width:auto;padding: 2px 7px; font-size: 13px; background: none; border: none; color: #888; cursor: pointer;"
          >✎</button>
        </h2>
        <div class="thesis-header-actions">
          <button class="btn btn-add" @click="showThesisModalForAdd">
            <span class="icon">➕</span>
          </button>
          <button
              @click="emit('maximize')"
              class="btn btn-minimize"
              title="Maximize"
            >
            ⤢
          </button>
          <button 
            class="btn btn-minimize" 
            @click="emit('minimize')"
            title="Close"
          >
            X
          </button>
        </div>
      </div>
      
      <div class="thesis-list">
        <div v-if="!thesisQuery.data.value || thesisQuery.data.value.length === 0" class="thesis-empty">
          <p>No thesis found. Click "Add New Thesis" to create one.</p>
        </div>
        
        <div v-else class="thesis-items">
          <!-- Render hierarchical thesis -->
          <template v-for="rootThesis in thesisHierarchy" :key="rootThesis.id">
            <ThesisItem 
              :thesis="rootThesis"
              :level="0"
              :thesis-stocks="thesisStocks"
              :expanded-thesis="expandedThesis"
              :editing-cell="editingCell"
              :editing-value="editingValue" 
              :stock-resources="stockResources"
              @toggle="toggleThesis"
              @edit="startEditThesis"
              @delete="deleteThesis"
              @add-stock="showAddStockModalForThesis"
              @delete-stock="deleteStock"
              @start-edit-cell="startEditCell"
              @save-edit="saveEdit"
              @cancel-edit="cancelEdit"
              @get-cell-metadata="getCellMetadata"
              @update-editing-value="updateEditingValue" 
              @add-resource="openResourceModal"  
              @delete-resource="deleteResource"
            />
          </template>
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
          
          <div class="form-group">
            <label :for="thesisModalMode === 'add' ? 'thesis-parent' : 'edit-thesis-parent'">
              Parent Thesis
            </label>
            <select 
              :id="thesisModalMode === 'add' ? 'thesis-parent' : 'edit-thesis-parent'"
              v-model="modalParentThesisId"
            >
              <option :value="null">None (Root Thesis)</option>
              <option 
                v-for="thesis in availableParentThesis" 
                :key="thesis.id" 
                :value="thesis.id"
              >
                {{ thesis.title }}
              </option>
            </select>
            <small class="form-hint">Select a parent thesis to create a hierarchical structure</small>
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

    <div v-if="showAppNameDialog" class="rename-dialog-backdrop">
      <div class="rename-dialog">
        <h3>Rename App</h3>
        <input v-model="appNameInput" placeholder="App name" />
        <div class="dialog-actions">
          <button @click="saveAppName">Save</button>
          <button @click="showAppNameDialog = false">Cancel</button>
        </div>
      </div>
    </div>

    <div v-if="showResourceModal" class="modal-overlay" @click="showResourceModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Add Resource</h3>
          <button class="modal-close" @click="showResourceModal = false">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Type</label>
            <select v-model="resourceType">
              <option value="pdf">PDF</option>
              <option value="link">Webpage/YouTube Link</option>
            </select>
          </div>
          <div v-if="resourceType === 'pdf'" class="form-group">
            <label>PDF File</label>
            <input type="file" accept="application/pdf" @change="e => resourceFile = e.target.files[0]" />
          </div>
          <div v-else class="form-group">
            <label>URL</label>
            <input type="url" v-model="resourceUrl" placeholder="https://..." />
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-cancel" @click="showResourceModal = false">Cancel</button>
          <button class="btn btn-primary" :disabled="resourceUploading" @click="saveResource">
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/*.thesis-card {
  padding: 0.75rem;
  border-radius: 0.75rem;
  border: 1px solid rgba(0,0,0,.1);
  box-shadow: 0 4px 12px rgba(0,0,0,.1);
  background: white;
}
*/
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
  margin-bottom: 0.25rem;
  padding-bottom: 0.25rem;
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
    padding: 0.2rem 0.4rem !important;
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

/* Hierarchy indentation */
.thesis-item-level-0 { margin-left: 0; }
.thesis-item-level-1 { margin-left: 2rem; }
.thesis-item-level-2 { margin-left: 4rem; }
.thesis-item-level-3 { margin-left: 6rem; }

.thesis-parent-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.125rem 0.5rem;
  background: #e9ecef;
  border-radius: 12px;
  font-size: 0.75rem;
  color: #6c757d;
  margin-left: 0.5rem;
}

.form-hint {
  display: block;
  margin-top: 0.375rem;
  font-size: 0.8125rem;
  color: #6c757d;
  font-style: italic;
}

.form-group select {
  width: 100%;
  padding: 0.625rem 0.875rem;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  font-size: 0.9375rem;
  background: white;
  cursor: pointer;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form-group select:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}
/* Rename Account Dialog Styles */
.rename-dialog-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
}

.rename-dialog {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  width: 400px;
  max-width: 90%;
}

.rename-dialog h3 {
  margin: 0 0 1rem 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

.rename-dialog input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 16px;
  color: #374151;
  margin-bottom: 1rem;
}

.rename-dialog .dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.rename-dialog button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.rename-dialog button:hover {
  background: #f3f4f6;
}

.rename-dialog button:active {
  background: #e5e7eb;
}

.rename-dialog button:first-child {
  background: #007bff;
  color: white;
}

.rename-dialog button:first-child:hover {
  background: #0056b3;
}

.rename-dialog button:first-child:active {
  background: #004085;
}
.rename-dialog-backdrop {
  position: fixed !important;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.3);
  z-index: 99999 !important;
  display: flex;
  align-items: center;
  justify-content: center;
}
.rename-dialog {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  z-index: 100000 !important;
  min-width: 320px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.25);
}
</style>