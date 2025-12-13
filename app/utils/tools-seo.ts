export default function (name: Registry[number]['name']) {
  const tool = registry.find(tool => tool.name === name)

  if (!tool) return {}

  return {
    title: tool.name,
    description: tool.description,
    ogTitle: tool.name,
    ogDescription: tool.description,
    twitterTitle: tool.name,
    twitterDescription: tool.description,
  }
}
