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

<script>
import { onMounted, ref } from 'vue'
import 'ag-grid-community/styles/ag-grid.css' // Mandatory CSS required by the Data Grid
import 'ag-grid-community/styles/ag-theme-quartz.css' // Optional Theme applied to the Data Grid
import { AgGridVue } from 'ag-grid-vue3' // Vue Data Grid Component
import apiClient from '../axios'
export default {
  components: {
    AgGridVue
  },
  setup() {
    const urlGetAllPatient = '/patients'
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'http://localhost:5173' // Allow requests from your Vue.js frontend
        // Add any other headers if needed
      }
    }
    const columnDefs = ref([
      { field: 'lastName' },
      { field: 'firstname' },
      { field: 'phoneNum' },
      { field: 'birthdate' },
      { field: 'address' },
      { field: 'Option' }
    ])
    const rowData = ref([])
    onMounted(() => {
      getAllPatient()
    })

    async function getAllPatient() {
      const response = await apiClient.get(urlGetAllPatient, options)

      console.log(response.data)
      response.data.forEach((element) => {
        rowData.value.push({
          lastName: element.name,
          firstname: element.firstname,
          phoneNum: element.phoneNum,
          birthdate: element.birthdate,
          address: element.address
        })
      })
      console.log('rowData', rowData)
    }

    return { rowData, columnDefs }
  }
}
</script>

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
