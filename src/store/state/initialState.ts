import { globalState } from "../../types/state";

export const InitialState: globalState = {
    showHeader: false,
    isLoading: false,
    token: null,
    menuItems: [],
    categories: [
        // {
        //     id: 218,
        //     show_all_products: false,
        //     category_id: 1,
        //     menu_id: 8,
        //     category: {
        //         id: 1,
        //         name: "Appetizers",
        //         description: "Start your meal with our delicious appetizers",
        //         products: []
        //     },
        //     menu: {
        //         id: 8,
        //         active: true,
        //         title: "Daily Menu",
        //         description: "Description for Daily Menu",
        //         publication_date: "2024-12-08"
        //     },
        //     products: [
        //         {
        //             id: 1,
        //             name: "Appetizers Product 1",
        //             description: "Description for Appetizers Product 1",
        //             price: "$72,74",
        //             image: "http://dev.backoffice.deliciusfood-test.ai/storage/01JA08QEDZW7PS19X0CX60DTXS.jpg",
        //             category_id: 1,
        //             code: "APPETIZERS1",
        //             active: 1,
        //             measure_unit: "unit",
        //             price_list: "8921.00",
        //             stock: 56,
        //             weight: "976.00",
        //             allow_sales_without_stock: 0
        //         },
        //         {
        //             id: 5,
        //             name: "Appetizers Product 5",
        //             description: "Description for Appetizers Product 5",
        //             price: "$66,55",
        //             image: "http://dev.backoffice.deliciusfood-test.ai/storage/01JA08QEDZW7PS19X0CX60DTXS.jpg",
        //             category_id: 1,
        //             code: "APPETIZERS5",
        //             active: 1,
        //             measure_unit: "unit",
        //             price_list: "3839.00",
        //             stock: 50,
        //             weight: "113.00",
        //             allow_sales_without_stock: 0
        //         },
        //         {
        //             id: 13,
        //             name: "Appetizers Product 13",
        //             description: "Description for Appetizers Product 13",
        //             price: "$59,28",
        //             image: "http://dev.backoffice.deliciusfood-test.ai/storage/01JA08QEDZW7PS19X0CX60DTXS.jpg",
        //             category_id: 1,
        //             code: "APPETIZERS13",
        //             active: 1,
        //             measure_unit: "unit",
        //             price_list: "5141.00",
        //             stock: 11,
        //             weight: "321.00",
        //             allow_sales_without_stock: 0
        //         }
        //     ]
        // },
        // {
        //     id: 219,
        //     show_all_products: true,
        //     category_id: 2,
        //     menu_id: 8,
        //     category: {
        //         id: 2,
        //         name: "Salads",
        //         description: "Fresh and healthy salads",
        //         products: [
        //             {
        //                 id: 21,
        //                 name: "Salads Product 1",
        //                 description: "Description for Salads Product 1",
        //                 price: "$99,26",
        //                 image: "http://dev.backoffice.deliciusfood-test.ai/storage/01JA08QEDZW7PS19X0CX60DTXS.jpg",
        //                 category_id: 2,
        //                 code: "SALADS1",
        //                 active: 1,
        //                 measure_unit: "unit",
        //                 price_list: "4157.00",
        //                 stock: 47,
        //                 weight: "436.00",
        //                 allow_sales_without_stock: 0
        //             },
        //             {
        //                 id: 22,
        //                 name: "Salads Product 2",
        //                 description: "Description for Salads Product 2",
        //                 price: "$98,04",
        //                 image: "http://dev.backoffice.deliciusfood-test.ai/storage/01JA08QEDZW7PS19X0CX60DTXS.jpg",
        //                 category_id: 2,
        //                 code: "SALADS2",
        //                 active: 1,
        //                 measure_unit: "unit",
        //                 price_list: "7942.00",
        //                 stock: 89,
        //                 weight: "420.00",
        //                 allow_sales_without_stock: 0
        //             },
        //             {
        //                 id: 23,
        //                 name: "Salads Product 3",
        //                 description: "Description for Salads Product 3",
        //                 price: "$53,61",
        //                 image: "http://dev.backoffice.deliciusfood-test.ai/storage/01JA08QEDZW7PS19X0CX60DTXS.jpg",
        //                 category_id: 2,
        //                 code: "SALADS3",
        //                 active: 1,
        //                 measure_unit: "unit",
        //                 price_list: "9143.00",
        //                 stock: 30,
        //                 weight: "271.00",
        //                 allow_sales_without_stock: 0
        //             }
        //         ]
        //     },
        //     menu: {
        //         id: 8,
        //         active: true,
        //         title: "Daily Menu",
        //         description: "Description for Daily Menu",
        //         publication_date: "2024-12-08"
        //     },
        //     products: []
        // }
    ],
    products: [],
    currentPage: 1,
    // hasMore: true,
    hasMore: false,
};