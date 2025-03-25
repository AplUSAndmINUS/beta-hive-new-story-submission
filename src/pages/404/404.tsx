import React from 'react';

import NavigateButtons from 'src/components/navigate-buttons/navigate-buttons';

export const NotFound: React.FC = () => {
  return (
    <div>
      <h1 className='bd-title pb-2'>404</h1>
      <p className='text-muted pb-2 mt-2 mb-5 fs-5'>
        Whoops! Looks like the page you're looking for wasn't found. <br />
        Please click the button below to head back to the home page.
      </p>
      <NavigateButtons
        backNavigation='Prompt Selection'
        isGoBack
        isNextDisabled={false}
        nextButtonText='Go to Home Page'
        nextNavigation='Home'
      />
    </div>
  );
};

export default NotFound;
