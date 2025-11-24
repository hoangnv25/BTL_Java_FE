import { useEffect } from 'react';

/**
 * Hook để thay đổi tiêu đề trang web
 * @param {string} pageName - Tên trang (ví dụ: "Home", "Chat", "Sản phẩm")
 * @param {string} brandName - Tên thương hiệu (mặc định: "FASHCO")
 */
export const usePageTitle = (pageName, brandName = 'FASHCO') => {
  useEffect(() => {
    const title = pageName ? `${brandName} | ${pageName}` : brandName;
    document.title = title;

    // Cleanup: reset về title mặc định khi component unmount
    return () => {
      document.title = brandName;
    };
  }, [pageName, brandName]);
};

