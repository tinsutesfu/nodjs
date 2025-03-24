import '../styles/pages/footer.css'
import { TiSocialFacebook,  TiSocialGithub,TiSocialLinkedin} from "react-icons/ti";


const Footer = () => {
  return (
    <div className='footer' id='footer'>
        <div className="foter-content">
            <div className="footer-content-left">
                <img src={'/images/t-zon.jpg'}/>
                <p>Stay stylish and productive with Tinsae. Explore our curated collection of high-performance laptops that elevate your everyday computing experience. Shop now and unlock your potential.</p>

                <div className="footer-social-icons">
  <span><a href="https://www.facebook.com/tinsaye tesfaye"><TiSocialFacebook /></a></span>
  <span><a href="https://www.linkedin.com/company/your-linkedin-company"><TiSocialLinkedin /></a></span>
  <span><a href="https://github.com/tinsutesfu"><TiSocialGithub /></a></span>
</div>

            </div>
            <div className="footer-content-middle">
  <h2>Company</h2>
  <ul>
    <li><a href="/">home</a></li>
    <li><a href="/about">About Us</a></li>
    <li><a href="/delivery">Delivery Info</a></li>
    <li><a href="/privacy">Privacy Policy</a></li>
  </ul>
</div>
            <div className="footer-content-right">
                <h2>get in touch</h2>
                <ul>
                    <li>+251-9 40 13 78 55</li>
                    <li>yetesfayes@gmail.com</li>
                </ul>
            </div>
        </div>
        <hr/>
        <p>Copyright © 2024 Tinsae Laptops. All Rights Reserved.</p>

    </div>
  )
}

export default Footer