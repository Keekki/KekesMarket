import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";
import { UserContext } from "./UserContext";
import MyAccount from "./MyAccount";

describe("MyAccount", () => {
  const user = {
    id: "1",
    token: "fake-token",
    name: "Timo Silakka",
    email: "timo@example.com",
    phoneNumber: "1234567890",
    city: "Tampere",
  };

  const setUser = jest.fn();
  const logoutUser = jest.fn();

  it("renders the My Account title", async () => {
    render(
      <BrowserRouter>
        <UserContext.Provider value={{ user, setUser, logoutUser }}>
          <MyAccount />
        </UserContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/my account/i)).toBeInTheDocument();
    });
  });
});
