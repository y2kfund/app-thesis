<script setup lang="ts">
import { onMounted, ref, watch, nextTick } from 'vue'
import { TabulatorFull as Tabulator } from 'tabulator-tables'
import 'tabulator-tables/dist/css/tabulator.min.css'
import type { Thesis } from '@y2kfund/core'

interface Props {
  thesis: any // Thesis with children
  level: number
  thesisStocks: Record<string, any[]>
  expandedThesis: Set<string>
  editingCell: any
  editingValue: any 
  stockResources: Record<string, any[]>
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
  'add-resource': [thesisId: string, stockId: string]
}>()

const tableRef = ref(null)
let tabulatorInstance: any = null

function getTabulatorData() {
  // Build tree data: each stock is a parent, its resources are children
  return (props.thesisStocks[props.thesis.id] || []).map(stock => ({
    id: stock.id,
    symbol: stock.symbol,
    pe_ratio: stock.pe_ratio,
    peg_ratio: stock.peg_ratio,
    analyst_ratings: stock.analyst_ratings,
    founder_led: stock.founder_led,
    next_earnings_date: stock.next_earnings_date,
    passed_checks: stock.passed_checks,
    currently_held: stock.currently_held,
    isResource: false,
    _children: (props.stockResources?.[stock.id] || []).map(resource => ({
      id: resource.id,
      parent: stock.id,
      isResource: true,
      type: resource.type,
      file_name: resource.file_name,
      url: resource.url,
    })),
  }))
}

function getTabulatorColumns() {
  return [
    { title: "Symbol", field: "symbol", editable: false },
    { 
      title: "PE Ratio", 
      field: "pe_ratio", 
      editor: "input",
      editable: true,
      cellEdited: async (cell: any) => {
        const data = cell.getData()
        const stock = (props.thesisStocks[props.thesis.id] || []).find(s => s.id === data.id)
        if (stock) {
          emit('save-edit', stock, cell.getField(), cell.getValue())
        }
      }
    },
    { 
      title: "PEG Ratio", 
      field: "peg_ratio", 
      editor: "input",
      editable: true,
      cellEdited: async (cell: any) => {
        const data = cell.getData()
        const stock = (props.thesisStocks[props.thesis.id] || []).find(s => s.id === data.id)
        if (stock) {
          emit('save-edit', stock, cell.getField(), cell.getValue())
        }
      }
    },
    { 
      title: "Analyst Ratings", 
      field: "analyst_ratings", 
      editor: "input",
      editable: true,
      cellEdited: async (cell: any) => {
        const data = cell.getData()
        const stock = (props.thesisStocks[props.thesis.id] || []).find(s => s.id === data.id)
        if (stock) {
          emit('save-edit', stock, cell.getField(), cell.getValue())
        }
      }
    },
    {
      title: "Founder Led",
      field: "founder_led",
      editor: true,
      formatter: "tickCross", // shows check/cross icons
      cellEdited: async (cell: any) => {
        const data = cell.getData()
        const stock = (props.thesisStocks[props.thesis.id] || []).find(s => s.id === data.id)
        if (stock) {
          emit('save-edit', stock, cell.getField(), cell.getValue())
        }
      }
    },
    { 
      title: "Next Earnings Date", 
      field: "next_earnings_date", 
      editor: "input",
      editable: true,
      cellEdited: async (cell: any) => {
        const data = cell.getData()
        const stock = (props.thesisStocks[props.thesis.id] || []).find(s => s.id === data.id)
        if (stock) {
          emit('save-edit', stock, cell.getField(), cell.getValue())
        }
      }
    },
    { 
      title: "Passed Checks", 
      field: "passed_checks", 
      editor: true,
      editorParams: { values: { true: "Yes", false: "No" } },
      formatter: "tickCross",
      cellEdited: async (cell: any) => {
        const data = cell.getData()
        const stock = (props.thesisStocks[props.thesis.id] || []).find(s => s.id === data.id)
        if (stock) {
          emit('save-edit', stock, cell.getField(), cell.getValue())
        }
      }
    },
    { 
      title: "Currently Held", 
      field: "currently_held", 
      editor: true,
      editorParams: { values: { true: "Yes", false: "No" } },
      formatter: "tickCross",
      cellEdited: async (cell: any) => {
        const data = cell.getData()
        const stock = (props.thesisStocks[props.thesis.id] || []).find(s => s.id === data.id)
        if (stock) {
          emit('save-edit', stock, cell.getField(), cell.getValue())
        }
      }
    },
    { 
      title: "Actions", 
      field: "actions", 
      formatter: (cell) => {
        const data = cell.getData()
        if (data.isResource) {
          return getResourceDisplay(cell)
        }
        return `
          <button class="tab-btn-add-resource" data-stock-id="${data.id}">➕</button>
          <button class="tab-btn-delete-stock" data-stock-id="${data.id}">🗑️</button>
        `
      },
      cellClick: (e, cell) => {
        const data = cell.getData()
        if (data.isResource) return
        if (e.target.classList.contains('tab-btn-add-resource')) {
          emit('add-resource', props.thesis.id, data.id)
        }
        if (e.target.classList.contains('tab-btn-delete-stock')) {
          emit('delete-stock', props.thesis.id, data.id, data.symbol)
        }
      }
    },
  ]
}

function getResourceDisplay(cell) {
  const data = cell.getData()
  if (data.type === 'pdf') {
    return `<span>📄 <a href="https://sb.y2k.fund/storage/v1/object/public/resources/${data.url}" target="_blank">${data.file_name}</a></span>`
  } else {
    return `<span>🔗 <a href="${data.url}" target="_blank">${data.url}</a></span>`
  }
}

function initTabulator() {
  if (!tableRef.value) return
  if (tabulatorInstance) {
    try { tabulatorInstance.destroy() } catch {}
    tabulatorInstance = null
  }
  tabulatorInstance = new Tabulator(tableRef.value, {
    data: getTabulatorData(),
    columns: getTabulatorColumns(),
    layout: "fitColumns",
    movableColumns: false,
    resizableRows: false,
    autoResize: true,
    responsiveLayout: "collapse",
    height: "auto",
    dataTree: true,
    placeholder: "No instruments found.",
    dataTreeStartExpanded: function(row) {
      // Only expand parent rows (not resource rows)
      return !row.getData().isResource
    },
    rowFormatter: function(row) {
      const data = row.getData()
      if (data.isResource) {
        // Get the number of columns in the table
        const colCount = row.getTable().getColumns().length
        // Clear the row
        const rowEl = row.getElement()
        rowEl.innerHTML = ""
        // Create a single cell with colspan
        const cell = document.createElement("td")
        cell.colSpan = colCount
        cell.style.background = "#f6f6f6"
        cell.style.fontStyle = "italic"
        cell.innerHTML = getResourceDisplay({ getData: () => data })
        rowEl.appendChild(cell)
      }
    },
    cellDblClick: undefined, // not needed for built-in editing
    cellEdited: async (cell: any) => {
      const data = cell.getData()
      console.log("Cell Edited:", data, data.isResource, cell.getField(), cell.getValue())
      if (!data.isResource) {
        // Find the real ThesisStock object
        const stock = (props.thesisStocks[props.thesis.id] || []).find(s => s.id === data.id)
        if (stock) {
          emit('save-edit', stock, cell.getField(), cell.getValue())
        }
      }
    }
  })
}

// Only initialize Tabulator when the table is visible and DOM is ready
watch(
  () => props.expandedThesis.has(props.thesis.id),
  async (expanded) => {
    if (expanded) {
      await nextTick()
      initTabulator()
    } else {
      if (tabulatorInstance) {
        try { tabulatorInstance.destroy() } catch {}
        tabulatorInstance = null
      }
    }
  },
  { immediate: true }
)

// Update data when stocks/resources change
watch(
  () => [props.thesisStocks[props.thesis.id], props.stockResources],
  () => {
    if (tabulatorInstance) {
      tabulatorInstance.replaceData(getTabulatorData())
    }
  },
  { deep: true }
)

watch(
  () => props.editingCell,
  () => {
    if (tabulatorInstance) {
      tabulatorInstance.redraw(true)
    }
  }
)

onMounted(() => {
  if (props.expandedThesis.has(props.thesis.id)) {
    nextTick(() => {
      initTabulator()
    })
  }
})

function updateValue(value: any) {
  emit('update-editing-value', value)
}
</script>

<template>
  <div :class="['thesis-item-wrapper', `thesis-item-level-${level}`]">
    <div class="thesis-item">
      <div class="thesis-content" @click="emit('toggle', props.thesis.id)">
        <div class="thesis-expand-icon">
          {{ props.expandedThesis.has(props.thesis.id) ? '▼' : '▶' }}
        </div>
        <div class="thesis-info">
          <div class="thesis-title">
            {{ props.thesis.title }}
            <span v-if="props.thesis.parent_thesis_id" class="thesis-parent-badge">
              ↳ Child
            </span>
          </div>
          <div v-if="props.thesis.description" class="thesis-description">
            {{ props.thesis.description }}
          </div>
        </div>
      </div>
      <div class="thesis-actions">
        <button 
          class="btn btn-secondary btn-sm btn-icon" 
          @click.stop="emit('edit', thesis)"
          title="Edit thesis"
        >
          ✏️
        </button>
        <button 
          class="btn btn-danger btn-sm btn-icon" 
          @click.stop="emit('delete', props.thesis.id, props.thesis.title)"
          title="Archive thesis"
        >
          🗑️
        </button>
      </div>
    </div>

    <!-- Stock table for expanded thesis -->
    <div v-if="props.expandedThesis.has(props.thesis.id)" class="stocks-section">
      <div class="stocks-header">
        <h4>Instruments ({{ props.thesisStocks[props.thesis.id]?.length || 0 }})</h4>
        <button 
          class="btn btn-primary btn-sm btn-icon" 
          @click.stop="emit('add-stock', props.thesis.id)"
          title="Add Instrument"
        >
          ➕
        </button>
      </div>

      <div ref="tableRef" style="width: 100%;"></div>
    </div>

    <!-- Render child thesis recursively -->
    <template v-if="props.thesis.children && props.thesis.children.length > 0">
      <ThesisItem 
        v-for="child in props.thesis.children" 
        :key="child.id"
        :thesis="child"
        :level="level + 1"
        :thesis-stocks="thesisStocks"
        :expanded-thesis="props.expandedThesis"
        :editing-cell="editingCell"
        :editing-value="editingValue" 
        :stock-resources="stockResources"
        @toggle="(id) => emit('toggle', id)"
        @edit="(t) => emit('edit', t)"
        @delete="(id, title) => emit('delete', id, title)"
        @add-stock="(id) => emit('add-stock', id)"
        @delete-stock="(tid, sid, sym) => emit('delete-stock', tid, sid, sym)"
        @start-edit-cell="(tid, s, f) => emit('start-edit-cell', tid, s, f)"
        @save-edit="(s, f, v) => emit('save-edit', s, f, v)"
        @cancel-edit="() => emit('cancel-edit')"
        @get-cell-metadata="(s, f) => emit('get-cell-metadata', s, f)"
        @update-editing-value="(v) => emit('update-editing-value', v)" 
        @add-resource="(tid, sid) => emit('add-resource', tid, sid)"
      />
    </template>
  </div>
</template>

<style scoped>
.thesis-item-wrapper {
  margin-top: 0.25rem;
}

.thesis-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 0.2rem 0.5rem 0rem 0.5rem;
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
  font-size: 0.875rem;
  line-height: 1.4;
}

.thesis-actions {
  display: flex;
  gap: 0.25rem;
  margin-left: 1rem;
  flex-shrink: 0;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
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

.btn-icon {
  padding: 0 !important;
    min-width: 32px;
    background: none !important;
    border: none;
    width: auto;
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
  margin-top: 0.25rem;
  padding: 0.2rem 0.5rem 0rem 0.5rem;;
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  margin-left: 2rem;
}
.tabulator-row.tabulator-tree-level-1 {
    padding-left: 28px;
}
.stocks-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.25rem;
}

.stocks-header h4 {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: #333;
}

.stocks-empty {
  padding: 0.75rem;
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
  padding: 0.25rem 0.5rem;
  text-align: left;
  font-weight: 600;
  color: #495057;
  border-bottom: 2px solid #dee2e6;
}

.stocks-table th:not(:first-child) {
  text-align: center;
}

.stocks-table td {
  padding: 0.25rem 0.5rem;
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
  width: 60px;
}

@media (max-width: 768px) {
  .thesis-item {
    flex-direction: column;
  }
  
  .thesis-actions {
    margin-left: 0;
    margin-top: 0.5rem;
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

<style>
.tabulator-row.tabulator-tree-level-1 {
    padding-left: 28px;
}
.tabulator-placeholder-contents {
  font-size: 1rem !important;
  padding: 0.25rem !important;
  color: #fff !important;
}
</style>