/** Match Header category links: `/category/${slugFromName(name)}` */
export function categorySlugFromName(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-')
}
