import React from "react";
import { Box, Card, CardContent, Typography, Avatar } from "@mui/material";

const StatCard = ({ title, value, icon, color, onClick }) => {
return (
        <Card 
        onClick={onClick}
        sx={{ 
            borderRadius: 4, 
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)', 
            border: '1px solid #f0f0f0',
            cursor: onClick ? 'pointer' : 'default', 
            transition: 'all 0.3s ease', 
            height: '100%',
            '&:hover': onClick ? { 
            transform: 'translateY(-5px)', 
            borderColor: color, 
            boxShadow: '0 8px 24px rgba(0,0,0,0.08)' 
            } : {}
        }}
        >
        <CardContent sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Avatar sx={{ 
                bgcolor: `${color}15`, // لون خلفية شفاف
                color: color, 
                width: 35, 
                height: 35 
            }}>
                {icon && React.cloneElement(icon, { sx: { fontSize: 20 } })}
            </Avatar>
            <Typography 
                variant="caption" 
                sx={{ 
                fontWeight: 700, 
                color: '#555', 
                fontFamily: 'Almarai' 
                }}
            >
                {title}
            </Typography>
            </Box>
            <Typography 
            variant="h5" 
            sx={{ 
                fontWeight: 800, 
                textAlign: 'right', 
                fontFamily: 'Almarai' 
            }}
            >
            {value}
            </Typography>
        </CardContent>
        </Card>
    );
};

export default StatCard;