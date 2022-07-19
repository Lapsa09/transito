import React, { useEffect, useState } from "react";
import { DateTime } from "luxon";
import { Table } from "../../components";
import { getDates, getOneDate } from "../../services/wazeService";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import style from "../../styles/Waze.module.css";
import { useNavigate } from "react-router-dom";

function History() {
  const [dias, setDias] = useState([]);
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  const fetch = async () => {
    const data = await getDates();
    setDias(data);
  };

  const fetchDia = async (id) => {
    const reportes = await getOneDate(id);
    setData(reportes);
  };

  const horarios = (data) => {
    const arr = Object.entries(data);
    return arr.slice(2);
  };

  useEffect(() => {
    fetch();
  }, []);
  return (
    <div className={style.historial}>
      <Drawer variant="permanent" anchor="left" className={style.sidebar}>
        <List>
          {dias.map((dia) => (
            <ListItem key={dia.id}>
              <ListItemButton onClick={() => fetchDia(dia.id)}>
                <ListItemText
                  primary={DateTime.fromISO(dia.fecha).toFormat("dd/MM/yyyy")}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <div className={style.dia}>
        <div className={style.header}>
          <button className={style.button} onClick={() => navigate(-1)}>
            Atras
          </button>
        </div>
        {horarios(data).map(([h, values]) => (
          <div className={style.reporte} key={h}>
            <h4>
              {DateTime.fromFormat(h, "hh:mm:ss").toLocaleString(
                DateTime.TIME_24_SIMPLE
              )}
              :
            </h4>
            <Table key={h} data={values} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default History;
