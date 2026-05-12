// Components
import CatalogComponent from "@/components/Catalog/CatalogComponent";


export default async function CatalogPage(
  {searchParams}
  :
  { readonly searchParams: Promise<{ filter?: string; sort?: string; page?: string }> }
) {
  const { filter: filterParam, sort: sortParam, page: pageParam } = await searchParams

  return (
    <main className="main-container">
      <CatalogComponent
        filterParam={filterParam}
        sortParam={sortParam}
        pageParam={pageParam}
      />
    </main>
  );
}
