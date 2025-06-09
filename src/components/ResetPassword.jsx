/* eslint-disable */
import React from 'react';

const ResetPassword = () => {
  return (
    <div>
      <h2>Reset Password</h2>
      <form>
        <div>
          <label>Email</label>
          <input type="email" required />
        </div>
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
};

export default ResetPassword; 