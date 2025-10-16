import React from 'react';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';

const SearchContainer = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.grey[300], 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.grey[400], 0.25),
    },
    border: `1px solid ${theme.palette.grey[300]}`,
    width: '100%',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.grey[600],
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: theme.palette.text.primary,
    width: '100%',
    fontSize: '0.95rem',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
    },
}));

interface SearchInputProps {
    placeholder?: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function SearchInput({
    placeholder = 'Search…',
    name,
    value,
    onChange,
}: SearchInputProps) {
    return (
        <SearchContainer>
            <SearchIconWrapper>
                <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
                placeholder={placeholder}
                inputProps={{ 'aria-label': 'search' }}
                name={name}
                value={value}
                onChange={onChange}
            />
        </SearchContainer>
    );
}
