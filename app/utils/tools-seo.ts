export default function (toolId: string) {
  const tool = registry.find(tool => tool.id === toolId)

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
