// services/api.js
export async function fetchJobs(page) {
    const response = await fetch(`https://testapi.getlokalapp.com/common/jobs?page=${page}`);
    const data = await response.json();
     console.log("dataa");
    return data.results || [];
  }