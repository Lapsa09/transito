import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LogoVL from '../../assets/imgs/LOGO_V_LOPEZ.png';
import LogoOVT from '../../assets/imgs/OVT_LETRAS_NEGRAS.png';
import { authActions } from '../../redux/userSlice';
import CustomPopover from './Popover';
import styles from '../../styles/Home.module.css';
import { Logout } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';

function Header() {
  const [dropdown, setDropdown] = useState(null);
  const dispatch = useDispatch();
  const user = useSelector((x) => x.user.user);
  const navigate = useNavigate();
  const handleLogout = () => {
    dispatch(authActions.logout());
  };

  const controles = [
    { link: '/control/diario', title: 'Diario' },
    { link: '/control/paseo', title: 'Paseo' },
  ];

  const operativos = [
    { link: '/operativos/autos', title: 'Autos' },
    { link: '/operativos/motos', title: 'Motos' },
    { link: '/operativos/camiones', title: 'Camiones' },
  ];

  const onMouseEnter = (_menu) => {
    if (window.innerWidth < 960) {
      setDropdown(null);
    } else {
      setDropdown(_menu);
    }
  };

  const onMouseLeave = () => {
    if (window.innerWidth < 960) {
      setDropdown(false);
    } else {
      setDropdown(false);
    }
  };
  return (
    <nav className={styles.header}>
      <img
        src={LogoVL}
        onClick={() => navigate('/')}
        alt="Logo Vicente Lopez"
      />
      {(user.rol === 'INSPECTOR' || user.rol === 'ADMIN') && (
        <div
          onMouseEnter={() => onMouseEnter('control')}
          onMouseLeave={onMouseLeave}
          className={styles['nav-link']}
        >
          <h3 className={styles.item}>Control</h3>
          {dropdown === 'control' && <CustomPopover links={controles} />}
        </div>
      )}
      {(user.rol === 'INSPECTOR' || user.rol === 'ADMIN') && (
        <div
          onMouseEnter={() => onMouseEnter('operativos')}
          onMouseLeave={onMouseLeave}
          className={styles['nav-link']}
        >
          <h3 className={styles.item}>Operativos</h3>
          {dropdown === 'operativos' && <CustomPopover links={operativos} />}
        </div>
      )}
      {(user.rol === 'ADMINISTRATIVO' || user.rol === 'ADMIN') && (
        <div
          onMouseEnter={() => onMouseEnter('sueldos')}
          onMouseLeave={onMouseLeave}
          className={styles['nav-link']}
        >
          <Link className={styles.item} to="/sueldos">
            Sueldos
          </Link>
        </div>
      )}
      {(user.rol === 'TRAFICO' || user.rol === 'ADMIN') && (
        <div
          onMouseEnter={() => onMouseEnter('waze')}
          onMouseLeave={onMouseLeave}
          className={styles['nav-link']}
        >
          <Link className={styles.item} to="/waze">
            Waze
          </Link>
        </div>
      )}
      <Logout className={styles.logout} onClick={handleLogout} />
      <img src={LogoOVT} alt="Logo Observatorio Vial" />
    </nav>
  );
}

export default Header;