import http from "../http-common";

class ProcesoCreativoDataService {
  getAll() {
    return http.get("/procesos_creativos");
  }

  get(id) {
    return http.get(`/procesos_creativos/${id}`);
  }

  create(data) {
    return http.post("/procesos_creativos", data);
  }

  update(id, data) {
    return http.put(`/procesos_creativos/${id}`, data);
  }

  delete(id) {
    return http.delete(`/procesos_creativos/${id}`);
  }
}

export default new ProcesoCreativoDataService();