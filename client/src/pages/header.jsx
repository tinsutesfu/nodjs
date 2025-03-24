import "../styles/pages/header.css";

const Header = () => {
  return (
    <div className="header" id="header">
      <div className="header-content">
        <h2>Elevate your style with the latest laptops</h2>
        <img src={"/images/laptop.jpg"} alt="Laptop" />
        <div className="left">
          <p>
            Discover a curated collection of stylish laptops that seamlessly
            blend performance and aesthetics. Our carefully selected devices
            empower you to express your unique style while staying ahead of the
            curve.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Header;