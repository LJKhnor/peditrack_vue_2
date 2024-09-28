<script>
import { ref } from 'vue'
import 'ag-grid-community/styles/ag-grid.css' // Mandatory CSS required by the Data Grid
import 'ag-grid-community/styles/ag-theme-quartz.css' // Optional Theme applied to the Data Grid
import { AgGridVue } from 'ag-grid-vue3' // Vue Data Grid Component
export default {
  components: {
    AgGridVue
  },
  setup() {
    const columnDefs = ref([
      { field: 'Nom' },
      { field: 'Prénom' },
      { field: 'Téléphone' },
      { field: 'Date de naissance' },
      { field: 'Adresse' },
      { field: 'Option' }
    ])
    const rowData = ref([
      {
        lastName: 'Lejeune',
        firstname: 'Joachim',
        phoneNum: '0474893021',
        birthdate: '18/12/1987',
        address: 'Chaussée de marche 250'
      },
      {
        lastName: 'Lizen',
        firstname: 'Val',
        phoneNum: '0477886853',
        birthdate: '22/06/1987',
        address: 'Chaussée de marche 250'
      }
    ])

    return { rowData, columnDefs }
  }
}
</script>
<template>
  <div class="data">
    <h1>Données</h1>
    <ag-grid-vue
      :rowData="rowData"
      :columnDefs="columnDefs"
      style="height: 500px"
      class="ag-theme-quartz"
      rowSelection="multiple"
      animateRows="true"
    ></ag-grid-vue>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
.data {
  text-align: center;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  font-size: 18px;
  font-family: Arial, sans-serif;
  text-align: left;
}

th,
td {
  padding: 12px 15px;
  border: 1px solid #ddd;
  color: black;
}

th {
  background-color: #4caf50;
  color: white;
  text-transform: uppercase;
}

tr {
  background-color: #f2f2f2;
  transition: background-color 0.3s ease;
}

tr:hover {
  background-color: #e9f5e9;
}

td {
  background-color: #fff;
}

table thead tr {
  border-bottom: 2px solid #4caf50;
}

/* Optional: Responsive Design */
@media (max-width: 600px) {
  table,
  thead,
  tbody,
  th,
  td,
  tr {
    display: block;
    width: 100%;
  }
  tr {
    margin-bottom: 15px;
  }
  th {
    background-color: #4caf50;
    text-align: center;
  }
}
</style>
