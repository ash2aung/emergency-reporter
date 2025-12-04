type PopupProps = {
  children?: React.ReactNode;
}

function PopupPane({ children }: PopupProps) {
  return (
    <div className='fixed inset-0 bg-black/50 z-[1000] overflow-y-hidden'>
      {children}
    </div>
  );
}

export default PopupPane;
