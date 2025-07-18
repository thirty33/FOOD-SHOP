import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  fireEvent,
  render,
  screen,
  act,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter, useNavigate } from "react-router-dom";
import { GlobalProvider } from "../../context/globalContext.tsx";
import { LoginForm } from "./index";
import { ROUTES } from "../../config/routes";
import { textMessages } from "../../config/textMessages";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe("<Login />", () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.mocked(useNavigate).mockImplementation(() => mockNavigate);
  });

  const handleLogin = () => {
    return render(
      <GlobalProvider>
        <MemoryRouter>
          <LoginForm />
        </MemoryRouter>
      </GlobalProvider>
    );
  };

  it("deberia realizar un login exitoso y redirigir a menus", async () => {
    
    vi.mock("../../hooks/useAuth", () => ({
      useAuth: () => ({
        setShowHeader: vi.fn(),
        authUser: vi.fn().mockResolvedValue({
          data: {
            token: "mock-token-12345",
            user: {
              id: 1,
              email: "test@test.com",
            },
          },
        }),
        isLoading: false,
        setToken: vi.fn(),
        setUser: vi.fn(),
      }),
    }));

    vi.mock("../../hooks/useNotification", () => ({
      useNotification: () => ({
        enqueueSnackbar: vi.fn(),
      }),
    }));

    handleLogin();

    const usernameInput = screen.getByPlaceholderText(textMessages.LOGIN_FORM.EMAIL_PLACEHOLDER);
    const passwordInput = screen.getByPlaceholderText(textMessages.LOGIN_FORM.PASSWORD_PLACEHOLDER);
    const submitButton = screen.getByText(textMessages.LOGIN_FORM.SUBMIT_BUTTON);

    await act(async () => {
      fireEvent.change(usernameInput, {
        target: { value: "test@test.com" },
      });
      fireEvent.change(passwordInput, { target: { value: "Password123!" } });
      fireEvent.click(submitButton);
    });

    await waitFor(
      () => {
        // Verificar que se llamó a setShowHeader con true
        // expect(mockSetShowHeader).toHaveBeenCalledWith(true);

        // // Verificar que se guardó el token
        // expect(mockSetToken).toHaveBeenCalledWith(mockAuthResponse.data.token);

        // Verificar que se redirigió a la página de menús
        expect(mockNavigate).toHaveBeenCalledWith(ROUTES.MENUS);
      },
      {
        timeout: 2000,
      }
    );
  });
});
