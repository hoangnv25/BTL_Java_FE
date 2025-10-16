import { Fragment } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Category() {

    const response = {
        "message": "Lấy danh sách danh mục thành công",
        "data": [
            {
                "category_id": 1,
                "name": "Nam",
                "parent_id": null
            },
            {
                "category_id": 2,
                "name": "Quần âu nam",
                "parent_id": 1
            },
            {
                "category_id": 3,
                "name": "Quần short nam",
                "parent_id": 1
            },
            {
                "category_id": 4,
                "name": "Quần tây nam",
                "parent_id": 1
            },
            {
                "category_id": 7,
                "name": "Áo thun nữ",
                "parent_id": 5
            },
            {
                "category_id": 5,
                "name": "Nữ",
                "parent_id": null
            },
            {
                "category_id": 6,
                "name": "Áo khoác nữ",
                "parent_id": 5
            }
        ]
    }


    const categories = response.data
    const parents = categories.filter((c) => c.parent_id === null)
    const navigate = useNavigate()

    function handleChildClick(categoryId, categoryName) {
        navigate(`/category/${categoryId}`, { state: { name: categoryName } })
    }

    return (
        <div>
            <ul>
                {parents.map((parent) => (
                    <Fragment key={`parent-${parent.category_id}`}>
                        <li key={parent.category_id}>{parent.name}</li>
                        {categories
                            .filter((child) => child.parent_id === parent.category_id)
                            .map((child) => (
                                <li key={child.category_id} className={'is-child'} onClick={() => handleChildClick(child.category_id, child.name)}>
                                    {/* <Link to={`/category/${child.category_id}`}>{child.name}</Link> */}
                                    {child.name}
                                </li>
                            ))}
                    </Fragment>
                ))}
            </ul>
        </div>
    )
}