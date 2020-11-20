export default (docs, tekton, report) => {
  for (const pipeline of Object.values<any>(tekton.pipelines)) {
    if (pipeline.spec.tasks.length > 42) {
      report(`Pipeline '${pipeline.metadata.name}' is too long.`, pipeline.spec);
    }
  }
}
