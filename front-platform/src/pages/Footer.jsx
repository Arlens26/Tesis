import { WhiteLogoEISCFooterIcon, FacebookIcon, YouTubeIcon, TwitterXIcon } from "../components/Icons"

export function FooterPage() {
    return (
      <>
        <footer className="bg-footer p-6">
          <div className=''>
            <WhiteLogoEISCFooterIcon />
          </div>
          <div className=''>
            <h5>
              Dirección:
            </h5>
            <ul>
              <li>Ciudad Universitaria Meléndez</li>
              <li>Calle 13 # 100-00</li>
              <br></br>
              <li>Sede San Fernando</li>
              <li>Calle 4B N° 36-00</li>
            </ul>
          </div>
          <div className='flex flex-col items-start'>
            <h5 className='mb-2'>Redes Sociales:</h5>
            <div className='flex space-x-2'>
              <a href="https://www.facebook.com/universidaddelvalle" target="_blank" rel="noopener noreferrer">
                <FacebookIcon/>
              </a>
              <a href="https://www.youtube.com/user/universidaddelvalle1" target="_blank" rel="noopener noreferrer">
                <YouTubeIcon/>  
              </a>
              <a href="https://x.com/univallecol" target="_blank" rel="noopener noreferrer">                
                <TwitterXIcon/> 
              </a>
            </div>
          </div>
        </footer>
      </>
    )
  }