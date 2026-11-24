import Link from "next/link";
import { categories } from "@/lib/news";
export function CategoryGrid(){return <div className="category-grid">{categories.map((category)=><Link href={`/categories/${category.slug}`} className="category-card" key={category.slug}><span className="category-icon">{category.icon}</span><span><b>{category.name}</b><small>{category.description}</small></span><i>→</i></Link>)}</div>}
