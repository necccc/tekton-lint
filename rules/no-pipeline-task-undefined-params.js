const { walk, pathToString } = require('../walk');

const check_defined_params = (resource, params, prefix, report) => (node, path, parent) => {
  if (path.includes('taskSpec')) return;
  const r1 = new RegExp(`\\$\\(${prefix}.(.*?)\\)`, 'g');
  const r2 = new RegExp(`\\$\\(${prefix}.(.*?)\\)`);
  const m = node.toString().match(r1);
  if (!m) return;
  for (const item of m) {
    const m2 = item.match(r2);
    const param = m2[1];
    if (typeof params[param] === 'undefined') {
      report(`Undefined param '${param}' at ${pathToString(path)} in '${resource}'`, parent, path[path.length - 1]);
    }
  }
};

module.exports = (docs, tekton, report) => {
  for (const pipeline of Object.values(tekton.pipelines)) {
    if (!pipeline.spec.params) continue;
    const params = Object.fromEntries(pipeline.spec.params.map(param => [param.name, 0]));

    walk(pipeline.spec.tasks, ['spec', 'tasks'], check_defined_params(pipeline.metadata.name, params, 'params', report));
  }
};
