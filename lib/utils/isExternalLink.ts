const isExternalLink = (link?: string): boolean => (link ? /^(http|mailto)/.test(link) : false)

export default isExternalLink
