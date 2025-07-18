import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Menus } from ".";
import * as menuHooks from "../../hooks/useMenus";
import { MenuData } from "../../types/menus";
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
        publication_date: "2024-10-28",
      },
      {
        id: 2,
        title: "Tuesday Menu",
        description: "Special menu for Tuesday",
        imageUrl: "test-image-url",
        publication_date: "2024-10-28",
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

    // Verify that menu cards are rendered with formatted dates
    // The component renders dates in Spanish format, not the title
    // For 2024-10-28, it should show "Lunes", "28", "de octubre"
    expect(screen.getAllByText("Lunes")).toHaveLength(2); // Both menus have same date
    expect(screen.getAllByText("28")).toHaveLength(2);
    expect(screen.getAllByText(/de octubre/)).toHaveLength(2);

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
      publication_date: menu.publication_date,
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
      // The component renders date parts separately, not as a single string
      // 2024-10-28 is a Monday (Lunes)
      expect(screen.getByText("Lunes")).toBeInTheDocument();
      expect(screen.getByText("28")).toBeInTheDocument();
      
      // 2024-10-29 is a Tuesday (Martes)
      expect(screen.getByText("Martes")).toBeInTheDocument();
      expect(screen.getByText("29")).toBeInTheDocument();
      
      // Both dates are in October 2024
      expect(screen.getAllByText(/de octubre/)).toHaveLength(2);
      expect(screen.getAllByText("2024")).toHaveLength(2);
    });

    // Verify that there's no loading spinner
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
});
