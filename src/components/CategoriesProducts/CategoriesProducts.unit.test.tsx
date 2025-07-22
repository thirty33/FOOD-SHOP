import { TestRouter } from '../../tests/utils/testWrappers'
import { describe, it, expect, vi, Mock, afterEach, beforeEach } from "vitest";
import { render, screen, act, waitFor } from "@testing-library/react";
import { GlobalProvider } from "../../context/globalContext.tsx";
import { CategoriesProducts } from "./index.tsx";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll.ts";
import { SnackbarProvider } from "notistack";
import { categoryService } from "../../services/category";
import { Pagination } from "../../types/responses";
import { Category } from "../../types/categories";
import { textMessages } from "../../config/textMessages.ts";

vi.mock("../../services/category", () => {
  return {
    categoryService: {
      list: vi.fn(),
    },
  };
});

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useParams: () => ({ menuId: "1" }),
  };
});

vi.mock("../../hooks/useInfiniteScroll.ts", () => ({
  useInfiniteScroll: vi.fn(),
}));

describe("<CategoriesProducts />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(categoryService.list).mockRejectedValue(new Error("API error"));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <GlobalProvider>
        <SnackbarProvider>
          <TestRouter>
            <CategoriesProducts />
          </TestRouter>
        </SnackbarProvider>
      </GlobalProvider>
    );
  };

  it("should display an error when the API call fails", async () => {
    const mockSetIsLoading = vi.fn();
    const mockSetCategories = vi.fn();

    (useInfiniteScroll as Mock).mockReturnValue({
      currentPage: 1,
      isLoading: false,
      categories: [],
      setIsLoading: mockSetIsLoading,
      setHasMore: vi.fn(),
      setCategories: mockSetCategories,
      setMenus: vi.fn(),
      setCurrenPage: vi.fn(),
      setLastPage: vi.fn(),
    });

    await act(async () => {
      renderComponent();
    });

    await waitFor(() => {
      expect(
        screen.getByText(textMessages.NO_CATEGORIES_MESSAGE)
      ).toBeInTheDocument();
    });

    expect(mockSetIsLoading).toHaveBeenCalledWith(true);
    expect(mockSetIsLoading).toHaveBeenCalledWith(false);
    expect(categoryService.list).toHaveBeenCalledWith("1", { page: 1 });
  });

  it("should handle successful API response", async () => {
    const mockResponse: Pagination<Category> = {
      links: [
        {
          url: "http://dev.backoffice.deliciusfood-test.ai/api/v1/categories/65?page=1",
          label: "&laquo; Previous",
          active: false,
        },
      ],
      current_page: 1,
      data: [
        {
          id: 333,
          order: 28,
          show_all_products: false,
          category_id: 8,
          menu_id: 65,
          category: {
            id: 8,
            name: "Seafood",
            description: "Fresh and tasty seafood",
            products: [],
            category_lines: [],
            subcategories: [],
            category_user_lines: [],
          },
          menu: {
            id: 65,
            active: true,
            title: "Convenio Consolidado Menu",
            description: "Description for Convenio Consolidado Menu",
            publication_date: "2025-01-03",
          },
          products: [
            {
              id: 141,
              image: "",
              name: "Seafood Product 1",
              description: "Description for Seafood Product 1",
              price: "$38,63",
              category_id: 8,
              code: "SEAFOOD1",
              active: 1,
              measure_unit: "unit",
              price_list: "8905.00",
              stock: 7,
              weight: "134.00",
              allow_sales_without_stock: 0,
              price_list_lines: [
                {
                  id: 29,
                  unit_price: "$92,80",
                  unit_price_with_tax: "$92,80",
                },
              ],
              ingredients: [
                {
                  descriptive_text:
                    "Auténtico Extracto estilo Jengibre Selecto",
                },
              ],
            },
          ],
        },
      ],
      first_page_url:
        "http://dev.backoffice.deliciusfood-test.ai/api/v1/categories/65?page=1",
      from: 1,
      last_page: 2,
      last_page_url:
        "http://dev.backoffice.deliciusfood-test.ai/api/v1/categories/65?page=2",
      next_page_url:
        "http://dev.backoffice.deliciusfood-test.ai/api/v1/categories/65?page=2",
      path: "http://dev.backoffice.deliciusfood-test.ai/api/v1/categories/65",
      per_page: 5,
      prev_page_url: null,
      to: 5,
      total: 7,
    };

    vi.mocked(categoryService.list).mockResolvedValue(mockResponse);

    const mockSetIsLoading = vi.fn();
    const mockSetCategories = vi.fn();

    (useInfiniteScroll as Mock).mockReturnValue({
      currentPage: 1,
      isLoading: false,
      categories: [],
      setIsLoading: mockSetIsLoading,
      setHasMore: vi.fn(),
      setCategories: mockSetCategories,
      setMenus: vi.fn(),
      setCurrenPage: vi.fn(),
      setLastPage: vi.fn(),
    });

    await act(async () => {
      renderComponent();
    });

    expect(categoryService.list).toHaveBeenCalledWith("1", { page: 1 });
    expect(mockSetIsLoading).toHaveBeenCalledWith(false);
  });
});
