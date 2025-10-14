<script setup lang="ts">
import type { Thesis } from '@y2kfund/core'

interface Props {
  thesis: any // Thesis with children
  level: number
  thesisStocks: Record<string, any[]>
  expandedThesis: Set<string>
  editingCell: any
  editingValue: any
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'toggle': [thesisId: string]
  'edit': [thesis: Thesis]
  'delete': [id: string, title: string]
  'add-stock': [thesisId: string]
  'delete-stock': [thesisId: string, stockId: string, symbol: string]
  'start-edit-cell': [thesisId: string, stock: any, field: string]
  'save-edit': [stock: any, field: string]
  'cancel-edit': []
  'get-cell-metadata': [stock: any, field: string]
  'update-editing-value': [value: any]
}>()

function updateValue(value: any) {
  emit('update-editing-value', value)
}
</script>

<template>
  <div :class="['thesis-item-wrapper', `thesis-item-level-${level}`]">
    <div class="thesis-item">
      <div class="thesis-content" @click="emit('toggle', thesis.id)">
        <div class="thesis-expand-icon">
          {{ expandedThesis.has(thesis.id) ? '▼' : '▶' }}
        </div>
        <div class="thesis-info">
          <div class="thesis-title">
            {{ thesis.title }}
            <span v-if="thesis.parent_thesis_id" class="thesis-parent-badge">
              ↳ Child
            </span>
          </div>
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
            <span v-if="thesis.children?.length > 0" class="thesis-children-count">
              {{ thesis.children.length }} child thesis
            </span>
          </div>
        </div>
      </div>
      <div class="thesis-actions">
        <button 
          class="btn btn-secondary btn-sm" 
          @click.stop="emit('edit', thesis)"
          title="Edit thesis"
        >
          ✏️ Edit
        </button>
        <button 
          class="btn btn-danger btn-sm" 
          @click.stop="emit('delete', thesis.id, thesis.title)"
          title="Archive thesis"
        >
          🗑️
        </button>
      </div>
    </div>

    <!-- Stock table for expanded thesis -->
    <div v-if="expandedThesis.has(thesis.id)" class="stocks-section">
      <div class="stocks-header">
        <h4>Instruments</h4>
        <button 
          class="btn btn-primary btn-sm" 
          @click.stop="emit('add-stock', thesis.id)"
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
              <th>Passed Checks</th>
              <th>Currently Held</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="stock in thesisStocks[thesis.id]" :key="stock.id">
              <td class="stock-symbol">{{ stock.symbol }}</td>
              
              <td 
                class="editable-cell"
                @dblclick="emit('start-edit-cell', thesis.id, stock, 'pe_ratio')"
              >
                <input
                  v-if="editingCell?.stockId === stock.id && editingCell?.field === 'pe_ratio'"
                  :value="editingValue"
                  type="number"
                  step="0.01"
                  @input="updateValue(($event.target as HTMLInputElement).valueAsNumber)"
                  @blur="emit('save-edit', stock, 'pe_ratio')"
                  @keyup.enter="emit('save-edit', stock, 'pe_ratio')"
                  @keyup.escape="emit('cancel-edit')"
                  autofocus
                />
                <span v-else>{{ stock.pe_ratio ?? '-' }}</span>
              </td>
              
              <td 
                class="editable-cell"
                @dblclick="emit('start-edit-cell', thesis.id, stock, 'peg_ratio')"
              >
                <input
                  v-if="editingCell?.stockId === stock.id && editingCell?.field === 'peg_ratio'"
                  :value="editingValue"
                  type="number"
                  step="0.01"
                  @input="updateValue(($event.target as HTMLInputElement).valueAsNumber)"
                  @blur="emit('save-edit', stock, 'peg_ratio')"
                  @keyup.enter="emit('save-edit', stock, 'peg_ratio')"
                  @keyup.escape="emit('cancel-edit')"
                  autofocus
                />
                <span v-else>{{ stock.peg_ratio ?? '-' }}</span>
              </td>
              
              <td 
                class="editable-cell checkbox-cell"
                @dblclick="emit('start-edit-cell', thesis.id, stock, 'passed_checks')"
              >
                <input
                  v-if="editingCell?.stockId === stock.id && editingCell?.field === 'passed_checks'"
                  :checked="editingValue"
                  type="checkbox"
                  @change="updateValue(($event.target as HTMLInputElement).checked)"
                  @blur="emit('save-edit', stock, 'passed_checks')"
                  @keyup.enter="emit('save-edit', stock, 'passed_checks')"
                  @keyup.escape="emit('cancel-edit')"
                  autofocus
                />
                <span v-else>{{ stock.passed_checks ? '✅' : '❌' }}</span>
              </td>
              
              <td 
                class="editable-cell checkbox-cell"
                @dblclick="emit('start-edit-cell', thesis.id, stock, 'currently_held')"
              >
                <input
                  v-if="editingCell?.stockId === stock.id && editingCell?.field === 'currently_held'"
                  :checked="editingValue"
                  type="checkbox"
                  @change="updateValue(($event.target as HTMLInputElement).checked)"
                  @blur="emit('save-edit', stock, 'currently_held')"
                  @keyup.enter="emit('save-edit', stock, 'currently_held')"
                  @keyup.escape="emit('cancel-edit')"
                  autofocus
                />
                <span v-else>{{ stock.currently_held ? '✅' : '❌' }}</span>
              </td>
              
              <td class="stock-actions">
                <button 
                  class="btn btn-danger btn-sm" 
                  @click.stop="emit('delete-stock', thesis.id, stock.id, stock.symbol)"
                  title="Remove instrument"
                >
                  🗑️
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Render child thesis recursively -->
    <template v-if="thesis.children && thesis.children.length > 0">
      <ThesisItem 
        v-for="child in thesis.children" 
        :key="child.id"
        :thesis="child"
        :level="level + 1"
        :thesis-stocks="thesisStocks"
        :expanded-thesis="expandedThesis"
        :editing-cell="editingCell"
        :editing-value="editingValue"
        @toggle="(id) => emit('toggle', id)"
        @edit="(t) => emit('edit', t)"
        @delete="(id, title) => emit('delete', id, title)"
        @add-stock="(id) => emit('add-stock', id)"
        @delete-stock="(tid, sid, sym) => emit('delete-stock', tid, sid, sym)"
        @start-edit-cell="(tid, s, f) => emit('start-edit-cell', tid, s, f)"
        @save-edit="(s, f) => emit('save-edit', s, f)"
        @cancel-edit="() => emit('cancel-edit')"
        @get-cell-metadata="(s, f) => emit('get-cell-metadata', s, f)"
        @update-editing-value="(v) => emit('update-editing-value', v)"
      />
    </template>
  </div>
</template>

<style scoped>
.thesis-item-wrapper {
  margin-top: 1rem;
}

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
  flex: 1;
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

.thesis-date {
  color: #868e96;
}

.thesis-stock-count {
  color: #007bff;
  font-weight: 500;
}

.thesis-children-count {
  color: #6c757d;
  font-style: italic;
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
  padding: 0.375rem 0.75rem;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  font-size: 0.8125rem;
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

.btn-primary:hover {
  background: #0056b3;
  border-color: #0056b3;
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

.btn-sm {
  padding: 0.375rem 0.75rem;
  font-size: 0.8125rem;
}

/* Hierarchy indentation */
.thesis-item-level-0 { margin-left: 0; }
.thesis-item-level-1 { margin-left: 2rem; }
.thesis-item-level-2 { margin-left: 4rem; }
.thesis-item-level-3 { margin-left: 6rem; }

/* Stocks section */
.stocks-section {
  margin-top: 1rem;
  padding: 0.75rem 1rem;
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  margin-left: 2rem;
}

.stocks-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
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

.stocks-table th:not(:first-child) {
  text-align: center;
}

.stocks-table td {
  padding: 0.5rem;
  border-bottom: 1px solid #e9ecef;
}

.stocks-table td:not(:first-child) {
  text-align: center;
}

.stocks-table tbody tr:hover {
  background: #f8f9fa;
}

.stock-symbol {
  font-weight: 600;
  color: #007bff;
}

.editable-cell {
  cursor: pointer;
  position: relative;
}

.editable-cell:hover {
  background: #e9ecef;
}

.editable-cell input[type="number"] {
  width: 80px;
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

@media (max-width: 768px) {
  .thesis-item {
    flex-direction: column;
  }
  
  .thesis-actions {
    margin-left: 0;
    margin-top: 0.75rem;
    width: 100%;
  }
  
  .thesis-item-level-1,
  .thesis-item-level-2,
  .thesis-item-level-3 {
    margin-left: 1rem;
  }
  
  .stocks-section {
    margin-left: 0;
    width: 100%;
  }
}
</style>