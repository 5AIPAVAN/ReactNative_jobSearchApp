export async function fetchJobs(page) {
  const response = await fetch(`https://testapi.getlokalapp.com/common/jobs?page=${page}`);
  const data = await response.json();

  return (data.results || []).map(job => ({
      id: job.id,
      title: job.title,
      company_name: job.company_name,
      primary_details: {
          Salary: job.primary_details?.Salary || null,
          Experience: job.primary_details?.Experience || null,
          Place: job.primary_details?.Place || null,
      },
      creatives: job.creatives[0].file || null,
      job_role: job.job_role,
      job_tags: job.job_tags,
      content: job.content,
      whatsapp_no: job.whatsapp_no,
      updated_on: job.updated_on,
      whatsapp_link:job.contact_preference?.whatsapp_link,
  }));
}
