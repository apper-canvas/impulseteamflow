import schedules from "@/services/mockData/schedules.json";

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const scheduleService = {
  async getAll() {
    await delay(300);
    return [...schedules];
  },

  async getById(id) {
    await delay(200);
    const schedule = schedules.find(sched => sched.Id === parseInt(id));
    if (!schedule) {
      throw new Error(`Schedule with Id ${id} not found`);
    }
    return { ...schedule };
  },

  async getByEmployeeId(employeeId) {
    await delay(250);
    return schedules.filter(sched => sched.employeeId === parseInt(employeeId));
  },

  async create(scheduleData) {
    await delay(400);
    const maxId = Math.max(...schedules.map(sched => sched.Id), 0);
    const newSchedule = {
      Id: maxId + 1,
      ...scheduleData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    schedules.push(newSchedule);
    return { ...newSchedule };
  },

  async update(id, scheduleData) {
    await delay(400);
    const index = schedules.findIndex(sched => sched.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Schedule with Id ${id} not found`);
    }
    
    const updatedSchedule = {
      ...schedules[index],
      ...scheduleData,
      Id: parseInt(id),
      updatedAt: new Date().toISOString()
    };
    
    schedules[index] = updatedSchedule;
    return { ...updatedSchedule };
  },

  async delete(id) {
    await delay(300);
    const index = schedules.findIndex(sched => sched.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Schedule with Id ${id} not found`);
    }
    
    const deletedSchedule = schedules.splice(index, 1)[0];
    return { ...deletedSchedule };
  }
};

export default scheduleService;