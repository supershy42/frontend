
const Bunnies = (props) => {
  return (
    <div
      style={{
        display: 'flex',
        height: 'clamp(28px, 3.5vw, 46.5px)',
        alignItems: 'flex-start',
        gap: 'clamp(30px, 5.5vw, 80px)',
      }}
    >
      <img
        src="/public/images/bunny.png"
        alt="bunny"
        style={{ width: 'clamp(30px, 3.5vw, 50px)', height: 'clamp(28px, 3.5vw, 46.5px)' }}
      />
      <img
        src="/public/images/bunny.png"
        alt="bunny"
        style={{ width: 'clamp(30px, 3.5vw, 50px)', height: 'clamp(28px, 3.5vw, 46.5px)' }}
      />
      <img
        src="/public/images/bunny.png"
        alt="bunny"
        style={{ width: 'clamp(30px, 3.5vw, 50px)', height: 'clamp(28px, 3.5vw, 46.5px)' }}
      />
    </div>
  );
};

export default Bunnies;
