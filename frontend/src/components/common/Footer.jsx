import { Link } from 'react-router-dom';
import appStoreImg from '../../assets/Mobile phone/App store.svg';
import playStoreImg from '../../assets/Mobile phone/Playstore.svg';
import footerBgImg from '../../assets/Footer/Footer background.png';
import phoneIconImg from '../../assets/Mobile phone/Group 14.svg';

const TRAVEL = [
  { label: 'Flights', path: '/?tab=flights' },
  { label: 'Hotels', path: '/?tab=hotels' },
  { label: 'Trains', path: '/?tab=trains' },
  { label: 'Tour Packages', path: '/tour-packages' }
];
const HOLIDAYS = [
  { label: 'International Tours', path: '/tour-packages' },
  { label: 'Domestic Tours', path: '/tour-packages' },
  { label: 'Honeymoon', path: '/tour-packages' }
];
const SUPPORT_LINKS = [
  { label: 'Help Center', path: '/support' },
  { label: 'Contact Us', path: '/contact-us' },
  { label: 'Refund Policy', path: '/refund-policy' },
  { label: 'Cancel Booking', path: '/cancel-booking' },
  { label: 'PNR Status', path: '/pnr-status' },
  { label: "FAQ's", path: '/support' }
];
const COMPANY = [
  { label: 'About Us', path: '/about-us' },
  { label: 'Careers', path: '/careers' }
];

const CompanyLogo = ({ className }) => (
  <svg viewBox="0 0 167 38" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M46.0575 29.8195C45.831 29.859 45.8569 29.8869 45.6687 29.8217C45.5652 29.3527 46.0184 28.6877 46.2035 28.2415L47.4713 25.1305C49.0779 21.089 50.7455 17.0692 52.4736 13.0721C52.7586 12.3963 53.0366 11.5939 53.3469 10.9527C54.4154 8.77705 54.6025 5.69799 57.6971 5.3103C61.6735 4.81215 62.4005 9.10405 63.5218 11.8436L66.3166 18.6431C66.5943 19.3192 67.4762 21.3076 67.5508 21.8736L63.8708 23.144C63.5178 22.5059 63.2714 21.8695 62.869 21.2352L60.1638 14.6611C59.5506 13.1689 58.7944 11.4276 58.2533 9.9216C56.556 14.1801 54.8217 18.4256 53.0503 22.6575C52.5426 23.9461 51.6259 26.589 51.0681 27.7266C49.8777 28.3353 46.998 29.1897 46.0575 29.8195Z" fill="white"/>
    <path d="M72.3826 13.0811L76.6771 13.0906C76.6146 13.7734 76.6425 15.1815 76.6318 15.9165C77.603 15.0349 78.3707 14.3859 79.6389 13.8502C81.6725 12.9913 84.428 12.8327 86.5354 13.5432C87.3766 13.8268 88.5809 14.5593 88.949 15.3374C87.173 15.9096 85.2594 16.4176 83.4484 16.9046C79.7562 17.8975 76.0633 19.2961 72.3843 20.2631L72.3826 13.0811Z" fill="white"/>
    <path d="M114.33 5.28366L118.635 5.27832C118.621 6.52593 118.643 7.81668 118.648 9.06781C117.605 9.17959 115.354 9.52617 114.327 9.74644C114.405 8.4989 114.333 6.58179 114.33 5.28366Z" fill="white"/>
    <path d="M92.8892 13.0827C93.7751 13.0761 96.6211 12.9811 97.2774 13.2205C95.9517 13.6305 94.5405 13.9358 93.1807 14.2414C93.0895 14.262 92.9934 14.271 92.9054 14.3014L92.8892 13.0827Z" fill="white"/>
    <path d="M138.49 7.83259C138.538 7.82686 138.586 7.82235 138.634 7.81906C138.881 7.80308 139.08 7.77663 139.242 7.91035C139.35 8.48652 139.237 9.88468 139.195 10.5344C136.132 10.5642 132.967 10.7516 129.912 10.9375C109.505 12.1788 89.7613 16.4683 70.3704 22.4386C65.7004 23.902 61.0561 25.4364 56.4391 27.0411C54.526 27.7048 51.1803 29.0018 49.3118 29.517C49.0685 29.5236 48.8299 29.5597 48.6377 29.4298L48.714 29.3136C49.2426 29.0163 51.897 28.0931 52.6248 27.8244C55.6585 26.6948 58.7005 25.5848 61.7505 24.4946C86.3665 15.7639 112.093 8.9627 138.49 7.83259Z" fill="#FE2C1C"/>
    <path d="M140.711 7.17773L144.699 7.18064L144.694 10.8496C143.384 10.8308 142.028 10.8478 140.714 10.8481C140.699 9.63221 140.711 8.39545 140.711 7.17773Z" fill="#FE2C1C"/>
    <path d="M110.976 13.5498L110.968 23.8995C110.968 25.702 111.156 30.2857 110.617 31.7735C107.55 40.2513 95.2036 39.7291 92.9692 30.6587C94.4202 30.6368 95.8705 30.6345 97.3216 30.6519C98.0772 32.1031 98.7051 33.0459 100.44 33.6087C101.63 33.9875 102.931 33.9101 104.061 33.3931C106.784 32.144 106.792 29.9453 106.763 27.4891C105.707 28.7562 104.443 29.7532 102.679 29.9541C100.482 30.2044 98.2238 29.5309 96.5032 28.2229C94.5481 26.7358 93.3152 24.9838 92.9602 22.634C92.79 21.5114 93.0433 17.6573 92.812 16.9645C94.1743 16.6539 95.8436 16.2732 97.2059 16.0488C97.0667 17.6069 97.1823 19.9138 97.1677 21.5127C97.1571 22.7159 97.7816 24.0564 98.7726 24.8751C99.7384 25.6754 101.007 25.9902C102.292 25.9902C103.573 25.9057 104.765 25.3469 105.607 24.4367C106.091 23.9128 106.429 23.2848 106.592 22.6084C106.925 21.2688 106.858 15.7597 106.738 14.2027C108.144 13.9491 109.557 13.7314 110.976 13.5498Z" fill="white"/>
    <path d="M148.177 13.0873C149.552 13.0593 151.029 13.085 152.412 13.0847C152.356 13.8747 152.367 14.7916 152.358 15.5918C153.948 13.5729 155.741 12.8886 158.407 13.1611C160.767 13.4023 162.849 14.5565 164.314 16.3072C165.791 18.0608 166.461 20.2947 166.177 22.514C165.894 24.7816 164.651 26.8471 162.729 28.2452C160.905 29.5867 158.761 30.205 156.445 29.9555C154.709 29.7685 153.406 28.7258 152.36 27.4695C152.562 30.8104 152.137 34.4785 152.408 37.7791L150.986 37.7679L148.193 37.7697C148.132 32.1766 148.174 26.4411 148.198 20.8421C149.575 20.8478 151.006 20.8718 152.378 20.8243C152.384 21.7255 152.384 22.3843 152.748 23.2378C154.01 26.1926 158.213 26.9533 160.615 24.7036C161.531 23.8418 162.046 22.675 162.05 21.4576C162.047 18.3221 158.517 16.1779 155.477 17.3006C155.018 17.47 154.614 17.7828 154.193 17.9471C152.614 18.5646 150.544 18.4024 149.324 17.1866C148.018 15.9299 148.18 14.6371 148.177 13.0873Z" fill="white"/>
    <path d="M123.865 13.0742L128.012 13.0828L127.991 15.927C130.591 13.062 134.946 12.4818 138.574 13.7616C137.906 14.9324 137.127 16.1318 136.437 17.3178C135.934 17.1483 135.404 17.0571 134.869 17.0479C132.962 17.0178 131.273 17.7988 129.921 19.0221C127.795 21.0958 127.991 23.2227 127.998 25.8802L128.013 30.0474C126.638 30.0247 125.216 30.0426 123.836 30.0436C123.852 24.4271 123.758 18.6756 123.865 13.0742Z" fill="white"/>
    <path d="M32.8598 6.41113L32.9942 6.44503C33.1125 7.14319 28.5515 20.1694 28.0252 22.1865C27.6944 23.4547 26.6399 25.8771 26.6457 27.3687C26.6471 27.7107 26.7376 27.9828 26.9992 28.2334C27.1056 28.3354 27.2757 28.4006 27.424 28.3827C29.6414 28.1146 29.642 23.7144 30.3073 23.0399C30.5457 22.9948 30.4596 22.9798 30.6641 23.0836C30.7994 23.3613 30.7494 23.7448 30.6641 23.0836C30.7994 23.3613 30.7494 23.7448 30.6883 24.0386C30.3877 25.4838 30.1307 27.4104 29.0563 28.5431C27.9992 29.9656 24.4089 30.8323 23.4134 29.1564C22.3898 27.4332 23.7854 23.9829 24.407 22.1934L26.8674 15.0739C27.2833 13.8836 27.7196 12.7039 28.1126 11.5026C28.3864 10.6652 27.422 10.292 26.7038 10.2311C26.3923 10.2047 26.146 10.3236 25.7965 10.2543L25.7546 10.1133C26.0887 9.34573 27.3468 8.98234 28.1108 8.58935C29.6572 7.79398 31.2587 7.10136 32.8598 6.41113Z" fill="#FE2C1C"/>
    <path d="M114.327 13.0463C115.76 12.8625 117.196 12.6935 118.632 12.5391C118.643 18.3463 118.573 24.2508 118.643 30.0463C117.281 30.0419 115.677 30.0251 114.336 30.0251C114.344 24.5106 114.46 18.5322 114.327 13.0463Z" fill="white"/>
    <path d="M140.666 13.0789L144.864 13.0781L144.866 25.2936C144.866 25.8797 144.902 29.6507 144.83 29.9938L144.708 30.0399L140.647 30.0297C140.713 27.8477 140.674 25.5235 140.674 23.3324L140.666 13.0789Z" fill="white"/>
    <path d="M85.8647 18.6545C87.2637 18.2726 88.6757 17.9326 90.0974 17.6348C90.5307 19.8251 90.4549 21.7079 90.4541 23.9208L90.4517 30.0539C89.0495 30.0356 87.6464 30.0325 86.2434 30.0444L86.2491 24.5625C86.2499 22.9515 86.3647 20.1417 85.8647 18.6545Z" fill="white"/>
    <path d="M72.3457 22.4264C72.5161 22.4069 73.4632 22.1131 73.6792 22.0519C74.7882 21.7378 75.8986 21.3535 77.025 21.0986C76.4176 23.3938 76.644 27.5115 76.6458 30.0521C75.2233 30.0363 73.8008 30.0318 72.3783 30.0384C72.3792 27.5283 72.4139 24.929 72.3457 22.4264Z" fill="white"/>
    <path d="M68.3525 23.709C69.2213 25.621 70.2122 28.0697 70.919 30.0348C69.5948 30.0383 67.6698 30.1015 66.3944 30.0319C66.2158 29.5493 64.5266 25.1217 64.3425 25.0051C65.3434 24.6038 67.2859 24.003 68.3525 23.709Z" fill="white"/>
    <path d="M9.22393 7.05994C7.35445 7.38183 6.04099 8.48623 4.99217 9.92613C4.74391 10.267 4.22818 11.0185 3.93925 11.2812L3.86464 11.2166C3.95155 9.34881 7.40622 6.12268 9.44045 5.84767C11.628 5.55195 14.2564 5.90244 16.5005 5.79627C19.6104 5.83239 22.5227 5.71438 25.5839 5.67871C25.4166 6.50777 24.9898 7.60745 24.7079 8.43654C24.3605 9.46075 24.0418 10.4934 23.752 11.5332C23.6443 11.9075 23.4775 13.0449 23.3735 13.1885C23.0375 13.2272 22.8602 13.2335 22.5214 13.2284C22.7588 10.1845 24.0189 6.65224 19.3368 6.51124C17.3563 6.45161 16.1826 6.4217 14.2222 6.79496C12.89 8.01641 12.7852 9.27702 12.3108 10.9237C11.9297 12.2293 11.5415 13.5331 11.1461 14.8351C10.8508 15.8075 10.1883 17.4583 9.9971 18.2509C11.8032 18.2492 14.2094 18.6091 15.5302 17.2756C16.0467 16.7542 16.2408 16.4328 16.6346 15.8504C17.0622 15.218 17.4733 13.3826 18.4544 13.5671C18.5583 13.71 18.5779 13.7162 18.5207 13.9049C17.5925 16.9693 16.6929 20.0896 16.0612 23.2168C16.0312 23.3657 15.9435 23.5351 15.8112 23.6226C15.5631 23.6832 15.4767 23.715 15.2316 23.6202C14.6051 22.9889 16.501 18.9359 13.074 19.007C12.1976 19.0252 10.6569 19.0543 9.78742 19.0026C9.32588 20.6015 8.85196 22.1971 8.36558 23.7894C7.95447 25.1421 7.5743 26.2572 7.37201 27.6645C7.09643 29.5818 10.4601 28.7323 10.716 29.6238C10.641 29.8422 10.677 29.7711 10.4693 29.9367C10.0039 30.0333 7.04223 29.9579 6.31185 29.9525C4.20784 29.9484 2.10384 29.9589 0 29.984V29.4403C0.62548 28.936 2.51857 29.2153 3.03406 28.3048C4.09981 26.4222 4.70205 23.8975 5.31773 21.8495L7.58083 14.296C8.10127 12.5399 8.65066 10.7935 9.12841 9.02647C9.3328 8.27047 9.29461 7.82359 9.22393 7.05994Z" fill="#FE2C1C"/>
    <path d="M34.9794 12.9738C34.4255 12.8104 33.3204 12.7946 33.1528 12.6275C33.4898 12.3009 37.4457 12.3749 38.0977 12.3568C38.2882 14.0472 38.5032 15.9191 38.5376 17.6156C38.5919 20.2884 39.0809 23.0601 39.0028 25.7125C40.5654 22.968 42.2071 20.2639 43.9259 17.6029C44.5918 16.5611 45.5072 15.0456 46.2383 14.0833C46.3911 12.8342 46.0874 12.9357 45.1384 12.4567C45.3016 12.3096 48.665 12.3429 49.0773 12.4298C48.84 12.8986 48.3127 12.7959 47.9284 13.2123C47.2494 13.9478 46.4264 14.9377 45.9138 15.7713C45.0663 17.1496 44.3537 18.67 43.5303 20.055C42.6845 21.4779 41.633 22.8464 40.8165 24.2894L38.4213 28.4464C37.9941 29.1893 37.4732 30.2211 36.9943 30.9089C34.8858 33.9375 32.5885 36.1737 28.8602 37.3479C27.967 37.6292 27.2195 37.7613 26.376 37.9997H24.1347C22.5097 37.4422 22.1016 37.1437 21.6917 35.5259C22.2209 34.0654 22.9743 32.4984 24.9148 33.4881C25.0988 33.7309 25.3118 33.9988 25.4687 34.2541C25.5414 35.4798 25.5213 35.8242 24.7147 36.8383C24.3002 37.3594 25.5899 37.452 25.9141 37.4107C28.4417 37.1232 31.6313 35.6661 33.3407 33.9018C33.7484 33.4809 36.5465 29.6051 36.5661 29.2816C36.7445 26.3455 36.172 23.339 35.8829 20.4423L35.4285 16.1892C35.3043 15.0423 35.2584 14.0995 34.9794 12.9738Z" fill="#FE2C1C"/>
    <path d="M161.156 0H162.857C164.166 0.623913 165.255 0.678261 166.155 2.29841C166.318 2.59317 166.625 3.48062 166.765 3.66028V5.25719C165.939 6.82495 165.834 7.76445 163.871 8.56036C162.723 9.01565 161.431 9.02651 160.274 8.59048C159.091 8.14948 158.144 7.2808 157.648 6.17916C157.161 5.10197 157.147 3.88722 157.609 2.80044C158.358 1.07358 159.516 0.649331 161.156 0ZM162.307 8.60852C163.6 8.47021 164.646 8.05207 165.479 7.06708C166.207 6.19205 166.535 5.0805 166.389 3.97812C166.125 1.85851 164.057 0.0108804 161.738 0.317831C161.705 0.322242 161.673 0.32785 161.64 0.334641C160.362 0.48137 159.341 0.907131 158.534 1.87957C157.797 2.78053 157.476 3.91992 157.638 5.04493C157.788 6.13607 158.397 7.12538 159.329 7.79182C160.05 8.30652 161.397 8.7424 162.307 8.60852Z" fill="white" fill-opacity="0.968627"/>
    <path d="M159.728 2.90307C160.168 2.89678 161.109 2.86156 161.5 2.9252L161.545 3.03426C161.453 2.99006 160.975 3.04141 160.839 3.05078C160.861 3.249 160.932 6.25935 160.938 6.24373C160.651 6.25118 160.448 6.28002 160.198 6.14403L160.449 5.94892C160.499 5.42669 160.602 3.61253 160.316 3.22477C159.918 3.20766 159.813 3.70593 159.682 4.01557L159.728 2.90307Z" fill="white" fill-opacity="0.980392"/>
    <path d="M163.458 3.93865C163.51 3.64273 163.566 3.139 163.733 2.90577C163.962 2.85956 164.089 2.89453 164.315 2.93435C164.319 3.16526 164.162 3.15858 164.164 3.21218C164.196 3.802 164.146 5.77615 164.484 6.19408C164.29 6.31688 163.652 6.18947L163.624 6.07387C163.681 5.99361 163.749 5.89503 163.83 5.77813C163.839 5.19561 163.771 4.46999 163.806 3.90371L163.743 4.0795L163.458 3.93865Z" fill="white"/>
    <path d="M162.063 3.41767C161.999 3.11404 162.049 3.21822 161.805 2.98949C161.982 2.87255 161.976 2.90715 162.217 2.8916C162.941 3.18753 162.799 4.81836 163.128 5.23072L163.203 5.05906L163.396 5.12524C163.309 5.44978 163.226 5.95304 162.988 6.15425C162.672 5.94869 162.537 4.47812 162.349 3.98092L162.215 3.92963C162.116 3.82019 162.091 3.57013 162.063 3.41767Z" fill="white"/>
    <path d="M162.066 3.41895C162.094 3.5714 162.119 3.82147 162.218 3.9309C162.304 4.28224 162.157 5.54966 162.056 5.92761C162.192 6.03353 162.235 6.06072 162.391 6.13935L162.31 6.21297C162.101 6.23376 161.893 6.28104 161.721 6.1751C161.985 5.06919 162.024 4.52702 162.066 3.41895Z" fill="white" fill-opacity="0.933333"/>
    <path d="M163.204 5.05933C163.21 4.77382 163.377 4.23648 163.458 3.93945L163.743 4.0803C163.419 4.45717 163.43 4.63476 163.397 5.12551L163.204 5.05933Z" fill="white" fill-opacity="0.890196"/>
  </svg>
);

const SOCIAL_LINKS = [
  {
    name: 'Facebook',
    href: '#',
    iconSize: 'w-[20px] h-[20px]',
    Icon: (props) => (
      <svg viewBox="0 0 24 24" fill="currentColor" className={props.className}>
        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
      </svg>
    )
  },
  {
    name: 'Instagram',
    href: '#',
    iconSize: 'w-[23px] h-[23px]',
    Icon: (props) => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <circle cx="12" cy="12" r="4"/>
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
      </svg>
    )
  },
  {
    name: 'X (Twitter)',
    href: '#',
    iconSize: 'w-[19px] h-[19px]',
    Icon: (props) => (
      <svg viewBox="0 0 24 24" fill="currentColor" className={props.className}>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    )
  },
  {
    name: 'YouTube',
    href: '#',
    iconSize: 'w-[21px] h-[21px]',
    Icon: (props) => (
      <svg viewBox="0 0 24 24" fill="currentColor" className={props.className}>
        <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.507a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.507 9.388.507 9.388.507s7.517 0 9.388-.507a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    )
  },
  {
    name: 'LinkedIn',
    href: '#',
    iconSize: 'w-[20px] h-[20px]',
    Icon: (props) => (
      <svg viewBox="0 0 24 24" fill="currentColor" className={props.className}>
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    )
  }
];

export default function Footer() {
  return (
    <footer 
      className="relative text-gray-300 w-full overflow-hidden font-satoshi"
      style={{
        backgroundImage: `url("${footerBgImg}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* ANYTRIP Watermark */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none select-none z-0">
        <span className="text-[12rem] md:text-[24rem] font-black text-[#ef3535] opacity-[0.035] tracking-[0.2em] uppercase font-sans">
          ANYTRIP
        </span>
      </div>

      {/* ── Main Footer Content ── */}
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 pt-16 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-4 text-left">
            <Link to="/" className="inline-flex items-center gap-2 mb-4 hover:opacity-90 transition-opacity no-underline">
              <CompanyLogo className="h-10 w-auto object-contain block" />
            </Link>
            <p className="text-gray-400 text-[16.5px] font-light leading-relaxed mb-6 pr-4">
              India's complete travel platform — Flights, Hotels, Trains, Tour Packages & Holiday Deals. Trusted by over 5 million+ travellers globally.
            </p>
            {/* Social Icons */}
            <div className="flex gap-4">
              {SOCIAL_LINKS.map(({ Icon, href, iconSize, name }, i) => (
                <a
                  key={i}
                  href={href}
                  className="w-[48px] h-[48px] rounded-full bg-[#242424] flex items-center justify-center text-white hover:bg-[#ef3535] active:scale-95 transition-all duration-300 shadow-[0_4px_10px_rgba(0,0,0,0.3)] hover:-translate-y-0.5"
                  title={name}
                >
                  <Icon className={`${iconSize} text-white`} />
                </a>
              ))}
            </div>
          </div>

          {/* Travel Services */}
          <div className="lg:col-span-2 text-left">
            <h4 className="text-white font-bold text-[20px] tracking-wide">Travel Services</h4>
            <div className="w-[32px] h-[2px] bg-[#ef3535] mt-2 mb-5"></div>
            <ul className="space-y-3 list-none p-0 m-0">
              {TRAVEL.map((item) => (
                <li key={item.label}>
                  <Link to={item.path} className="text-[17px] font-light text-gray-400 hover:text-[#ef3535] transition-colors no-underline">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Holidays Deals */}
          <div className="lg:col-span-2 text-left">
            <h4 className="text-white font-bold text-[20px] tracking-wide">Holidays Deals</h4>
            <div className="w-[32px] h-[2px] bg-[#ef3535] mt-2 mb-5"></div>
            <ul className="space-y-3 list-none p-0 m-0">
              {HOLIDAYS.map((item) => (
                <li key={item.label}>
                  <Link to={item.path} className="text-[17px] font-light text-gray-400 hover:text-[#ef3535] transition-colors no-underline">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="lg:col-span-2 text-left">
            <h4 className="text-white font-bold text-[20px] tracking-wide">Support</h4>
            <div className="w-[32px] h-[2px] bg-[#ef3535] mt-2 mb-5"></div>
            <ul className="space-y-3 list-none p-0 m-0">
              {SUPPORT_LINKS.map((item) => (
                <li key={item.label}>
                  <Link to={item.path} className="text-[17px] font-light text-gray-400 hover:text-[#ef3535] transition-colors no-underline">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="lg:col-span-2 text-left">
            <h4 className="text-white font-bold text-[20px] tracking-wide">Company</h4>
            <div className="w-[32px] h-[2px] bg-[#ef3535] mt-2 mb-5"></div>
            <ul className="space-y-3 list-none p-0 m-0">
              {COMPANY.map((item) => (
                <li key={item.label}>
                  <Link to={item.path} className="text-[17px] font-light text-gray-400 hover:text-[#ef3535] transition-colors no-underline">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── App Download Banner ── */}
      <div className="relative z-10 px-4 lg:px-8 pb-8 pt-2">
        <div
          className="max-w-[1400px] mx-auto rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6 px-8 py-6 bg-[#111111]/70 backdrop-blur-md border border-white/10"
        >
          {/* Left: Red circle icon + Text */}
          <div className="flex items-center gap-5">
            <img src={phoneIconImg} alt="FlyAnyTrip App" className="flex-shrink-0 w-[56px] h-[56px] object-contain" />
            <div className="text-left">
              <p className="text-white text-[22px] font-bold leading-tight mb-1">
                Download the <span className="text-[#ef3535]">FlyAnyTrip</span> App
              </p>
              <p className="text-gray-400 text-[16.5px] font-light leading-snug">
                Exclusive app-only deals + offline access to tickets
              </p>
            </div>
          </div>

          {/* Vertical Divider */}
          <div className="hidden sm:block w-px h-12 bg-white/10 flex-shrink-0" />

          {/* Right: Store Badges */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <a href="https://apps.apple.com" target="_blank" rel="noopener noreferrer"
              className="transition-all hover:scale-[1.05] hover:-translate-y-0.5 active:scale-95 duration-200 block">
              <img src={appStoreImg} alt="Download on the App Store" className="h-[44px] w-auto object-contain block" />
            </a>
            <a href="https://play.google.com/store/apps?hl=en_IN" target="_blank" rel="noopener noreferrer"
              className="transition-all hover:scale-[1.05] hover:-translate-y-0.5 active:scale-95 duration-200 block">
              <img src={playStoreImg} alt="Get it on Google Play" className="h-[44px] w-auto object-contain block" />
            </a>
          </div>
        </div>
      </div>

      {/* ── Copyright Footer ── */}
      <div className="border-t border-white/10 bg-black/45 py-8 relative z-10">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-[16px] text-gray-500">
          <div className="flex flex-col gap-1.5 text-center md:text-left">
            <p className="text-gray-400 font-medium">© 2026 AnyTrip India Pvt Ltd. All rights reserved.</p>
            <p className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-[14px] text-gray-400 font-light">
              <span>Designed & Built with <span className="text-[#ef3535]">❤️</span> by</span>
              <span className="font-semibold text-white bg-gradient-to-r from-red-500 via-amber-300 to-red-400 bg-clip-text text-transparent px-2 py-0.5 rounded bg-white/5 border border-white/10">
                Milan Pandavadra (Lead Full Stack Engineer)
              </span>
            </p>
            <p className="flex items-center justify-center md:justify-start gap-2 text-[13px] text-gray-500 font-light mt-0.5">
              <span>IATA Certified</span>
              <span className="text-[#ef3535] font-bold">•</span>
              <span>PCI DSS Level 1</span>
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 md:gap-5 text-gray-400">
            <Link to="/privacy-policy" className="hover:text-white transition-colors no-underline font-light text-[16px]">Privacy Policy</Link>
            <span className="text-[#ef3535] font-bold">•</span>
            <Link to="/terms-and-conditions" className="hover:text-white transition-colors no-underline font-light text-[16px]">Terms & Conditions</Link>
            <span className="text-[#ef3535] font-bold">•</span>
            <Link to="/sitemap" className="hover:text-white transition-colors no-underline font-light text-[16px]">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
