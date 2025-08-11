import departments from "@/services/mockData/departments.json";

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const departmentService = {
  async getAll() {
    await delay(250);
    return [...departments];
  },

  async getById(id) {
    await delay(200);
    const department = departments.find(dept => dept.Id === parseInt(id));
    if (!department) {
      throw new Error(`Department with Id ${id} not found`);
    }
    return { ...department };
  },

  async create(departmentData) {
    await delay(400);
    const maxId = Math.max(...departments.map(dept => dept.Id), 0);
    const newDepartment = {
      Id: maxId + 1,
      ...departmentData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    departments.push(newDepartment);
    return { ...newDepartment };
  },

  async update(id, departmentData) {
    await delay(400);
    const index = departments.findIndex(dept => dept.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Department with Id ${id} not found`);
    }
    
    const updatedDepartment = {
      ...departments[index],
      ...departmentData,
      Id: parseInt(id),
      updatedAt: new Date().toISOString()
    };
    
    departments[index] = updatedDepartment;
    return { ...updatedDepartment };
  },

  async delete(id) {
    await delay(300);
    const index = departments.findIndex(dept => dept.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Department with Id ${id} not found`);
    }
    
    const deletedDepartment = departments.splice(index, 1)[0];
    return { ...deletedDepartment };
  }
};

export default departmentService;