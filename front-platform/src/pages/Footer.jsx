import { WhiteLogoEISCFooterIcon, FacebookIcon, YouTubeIcon, TwitterXIcon } from "../components/Icons"

export function FooterPage() {
    return (
      <>
        <footer className='bg-footer p-6 flex flex-col sm:flex-row justify-around items-center text-white text-center sm:text-left space-y-8 sm:space-y-0 sm:space-x-8'>
          <div className=''>
            <WhiteLogoEISCFooterIcon className="w-auto lg:w-auto md:w-80 md:h-40 sm:w-80 sm:h-40 xs:w-80 xs:h-40" />
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
                <FacebookIcon className="w-auto lg:w-auto md:w-20 sm:w-20 xs:w-20"/>
              </a>
              <a href="https://www.youtube.com/user/universidaddelvalle1" target="_blank" rel="noopener noreferrer">
                <YouTubeIcon className="w-auto lg:w-auto md:w-20 sm:w-20 xs:w-20"/>  
              </a>
              <a href="https://x.com/univallecol" target="_blank" rel="noopener noreferrer">                
                <TwitterXIcon className="w-auto lg:w-auto md:w-20 sm:w-20 xs:w-20"/> 
              </a>
            </div>
          </div>
        </footer>
      </>
    )
  }