import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Menus } from ".";
import * as menuHooks from "../../hooks/useMenus";
import { menuService } from "../../services/menu";
import { MenuApiResponse, MenuData } from "../../types/menus";
import { SuccessResponse, Pagination } from "../../types/responses";
import { formatDate } from "../../helpers/dates";

// Mock the useMenus hook
vi.mock("../../hooks/useMenus", () => ({
  useMenus: vi.fn(),
}));

vi.mock("../../services/menu", () => ({
  menuService: {
    list: vi.fn(),
  },
}));

// Mock VITE_TIMEZONE environment variable
vi.mock("import.meta", () => ({
  env: {
    VITE_TIMEZONE: "America/Lima",
  },
}));

describe("Menus Component", () => {

  it("should render menu cards when menu items are provided", () => {
    // Mock data that matches the API response structure
    const mockMenuItems = [
      {
        id: 1,
        title: "Monday Menu",
        description: "Special menu for Monday",
        imageUrl: "test-image-url",
      },
      {
        id: 2,
        title: "Tuesday Menu",
        description: "Special menu for Tuesday",
        imageUrl: "test-image-url",
      },
    ];

    // Mock the useMenus hook implementation
    vi.spyOn(menuHooks, "useMenus").mockImplementation(() => ({
      menuItems: mockMenuItems,
      isLoading: false,
      setSelectedMenu: vi.fn(),
    }));

    // Render the component within Router context since it uses navigation
    render(
      <BrowserRouter>
        <Menus />
      </BrowserRouter>
    );

    // Verify that menu cards are rendered
    mockMenuItems.forEach((menu) => {
      expect(screen.getByText(menu.title)).toBeInTheDocument();
    });

    // Verify that there's no "No hay Menús disponibles!" message
    expect(
      screen.queryByText(/No hay Menús disponibles!/i)
    ).not.toBeInTheDocument();

    // Verify that the loading spinner is not shown
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("should render menus from service response", async () => {
    // Mock service response that matches the API structure
    const mockApiResponse: SuccessResponse<Pagination<MenuData>> = {
      status: "success",
      message: "Menus retrieved successfully",
      data: {
        current_page: 1,
        data: [
          {
            id: 1,
            active: true,
            title: "menu test 1",
            description: "description test 1",
            publication_date: "2024-10-28",
          },
          {
            id: 2,
            active: true,
            title: "menu test 2",
            description: "description test 2",
            publication_date: "2024-10-29",
          },
        ],
        first_page_url: "http://test.api/menus?page=1",
        from: 1,
        last_page: 1,
        last_page_url: "http://test.api/menus?page=1",
        links: [],
        next_page_url: null,
        path: "http://test.api/menus",
        per_page: 15,
        prev_page_url: null,
        to: 2,
        total: 2,
      },
    };

    // Transform the data as the service would
    const transformedMenuItems = mockApiResponse.data.data.map((menu) => ({
      id: menu.id,
      title: formatDate(menu.publication_date),
      description: menu.description,
      imageUrl: "test-image-url",
    }));

    // Mock the useMenus hook to return the transformed data
    vi.spyOn(menuHooks, "useMenus").mockImplementation(() => ({
      menuItems: transformedMenuItems,
      isLoading: false,
      setSelectedMenu: vi.fn(),
    }));
    
    // Render the component
    render(
      <BrowserRouter>
        <Menus />
      </BrowserRouter>
    );

    // Wait for the menus to be rendered and verify the formatted dates
    await waitFor(() => {
      // 2024-10-28 is a Monday (Lunes)
      expect(
        screen.getByText("lunes 28 de octubre de 2024")
      ).toBeInTheDocument();
      // 2024-10-29 is a Tuesday (Martes)
      expect(
        screen.getByText("martes 29 de octubre de 2024")
      ).toBeInTheDocument();
    });

    // Verify that there's no loading spinner
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
});
