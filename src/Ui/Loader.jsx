


const Loader = () => {
    const spinnerDivs = Array.from({ length: 10 }).map((_, index) => {
        const delay = (index + 1) * 0.1;
        const rotation = (index + 1) * 36;
        const translation = 150;

        return (
            <div key={index} className='absolute w-[50%] h-[140%] bg-primary'
                style={{
                    '--delay': delay,
              '--rotation': rotation,
              '--translation': translation,
              transform: `rotate(calc(var(--rotation) * 1deg)) translate(0, calc(var(--translation) * 1%))`,
              animation: `spinner-animation 1s calc(var(--delay) * 1s) infinite ease`}}
            ></div> );
          });


    return (
          <div className='absolute w-[9px] h-[9px]'>
            {spinnerDivs}
            <style>
              {`
                @keyframes spinner-animation {
                0%, 10%, 20%, 30%, 50%, 60%, 70%, 80%, 90%, 100% {
                transform: rotate(calc(var(--rotation) * 1deg)) translate(0, calc(var(--translation) * 1%));
               }
               50% {
                transform: rotate(calc(var(--rotation) * 1deg)) translate(0, calc(var(--translation) * 1.5%));
               }
              }
            `}
            </style>
          </div>
          );
          };

export default Loader;
          