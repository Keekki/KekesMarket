import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import HomePage from "./HomePage";

describe("HomePage", () => {
  it("renders without crashing", () => {
    render(<HomePage />);
    expect(screen.getByText(/Looking for/i)).toBeInTheDocument();
  });

  it("contains all items in the typing animation", () => {
    render(<HomePage />);
    const items = [
      "a bike",
      "shoes",
      "clothing",
      "a PC",
      "an Xbox",
      "a sofa",
      "a TV",
      "furniture",
    ];
    items.forEach(async (item) => {
      expect(
        await screen.findByText(item, {}, { timeout: 1500 })
      ).toBeInTheDocument();
    });
  });

  it("displays static texts correctly", () => {
    render(<HomePage />);
    expect(screen.getByText(/Looking for/i)).toBeInTheDocument();
    expect(screen.getByText(/\?/i)).toBeInTheDocument();
    expect(screen.getByText(/Feel free to explore!/i)).toBeInTheDocument();
  });

  it("renders the FeaturedItems component", () => {
    render(<HomePage />);
    expect(screen.getByText(/Listings you might like/i)).toBeInTheDocument();
  });
});
