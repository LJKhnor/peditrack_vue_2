declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
declare module '../axios' {
  import { AxiosInstance } from 'axios'
  const apiClient: AxiosInstance
  export default apiClient
}
