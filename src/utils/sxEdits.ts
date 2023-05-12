export const adminStyle = {
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
}

export const sxStyles = {
  basicWidth: { width: { lg: '40%', md: '60%', sm: '80%', xs: '100%' } },
  basicMaxHeight: { maxHeight: { xs: '30px', sm: '70px' } },
  flex: { display: 'flex' },
  flexColumn: { display: 'flex', flexDirection: 'column' },
  flexRow: { display: 'flex', flexDirection: 'row' },
  spaceBetween: { display: 'flex', justifyContent: 'space-between' },
  flexSmall: {
    display: { xs: 'flex', lg: 'none' },
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flexLarge: {
    display: { xs: 'none', lg: 'flex' },
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flexColumnCenter: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  flexRowCenter: { display: 'flex', alignItems: 'center' },
  noMargin: { margin: 0 },
  fullWidth: { width: '100%' },
}
