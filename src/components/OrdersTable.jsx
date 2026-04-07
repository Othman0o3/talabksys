import React from "react";
import { Paper, Chip } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const getStatusStyle = (status) => {
  const styles = {
    "تم التسليم": { color: "success" },
    "تمت التسوية": { color: "success" },
    "مكتمل": { color: "success" },
    "تحت الاجراء": { color: "info" },
    "قيد التنفيذ": { color: "info" },
    "قيد الشحن": { color: "secondary" },
    "راجع في الطريق الى الفرع": { color: "secondary" },
    "راجع": { color: "error" },
    "تم الالغاء": { color: "error" },
    "تم الاسترداد": { color: "warning" },
    "في المكتب انتظار الاستلام": { color: "default" },
    "تأجيل": { color: "default" },
  };
  return styles[status] || { color: "default" };
};

const OrdersDataGrid = ({ 
  rows, 
  loading, 
  onRowClick,
  hideFooter = false 
}) => {
  
  const columns = [
    { 
      field: "orderNumber", 
      headerName: "رقم الطلب", 
      width: 100, 
      renderCell: (p) => <b>#{p.value}</b> 
    },
    { field: "customerName", headerName: "العميل", width: 150 },
    { field: "date", headerName: "التاريخ", width: 100 },
    { 
      field: "state", 
      headerName: "الحالة", 
      width: 140,
      renderCell: (params) => {
        const style = getStatusStyle(params.value);
        return (
          <Chip 
            label={params.value} 
            color={style.color} 
            size="small" 
            sx={{ fontWeight: '800', fontFamily: 'Almarai', fontSize: '0.7rem' }} 
          />
        );
      }
    },
    { field: "city", headerName: "المدينة", width: 100 },
    { field: "phone1", headerName: "الهاتف", width: 110 },
    { field: "DelegateNumber1", headerName: "رقم المندوب 1", width: 150 },
    { field: "DelegateNumber2", headerName: "رقم المندوب 2", width: 150 },
  ];

  return (
    <Paper elevation={0} sx={{ 
      width: '100%', 
      borderRadius: 4, 
      overflow: 'hidden',
      border: '1px solid #eee',
    }}>
      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        autoHeight 
        density="comfortable" 
        hideFooter={hideFooter} 
        disableRowSelectionOnClick
        onRowClick={onRowClick}
        sx={{ 
            border: 'none', 
            fontFamily: 'Almarai',
            '& .MuiDataGrid-columnHeader': {
                backgroundColor: '#fcfcfc',
                borderBottom: '1px solid #eee'
            },
            '& .MuiDataGrid-cell': {
                borderBottom: '1px solid #f9f9f9'
            },
            '& .MuiDataGrid-columnHeaderTitle': {
                fontWeight: '900'
            }
        }}
      />
    </Paper>
  );
};

export default OrdersDataGrid;