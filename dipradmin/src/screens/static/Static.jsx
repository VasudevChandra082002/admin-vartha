
import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { StaticWrapper } from "../../screens/static/static.style";
import StaticTable from "../../components/static/statictable";
// import PhotosTable from "../../components/photos/photostable";
// import BannersTable from "../../components/banners/BannersTable";

function StaticPage() {
  const navigate = useNavigate();

  const handleAddBannerClick = () => {
    navigate("/website-pages/addpages"); // Navigate to the new banner creation page
  };

  return (
    <StaticWrapper>
      <div className="header-section">
        <div className="block-title">Websites</div>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          className="add-article-btn"
          onClick={handleAddBannerClick}
        >
          Add Websites
        </Button>
      </div>

      {/* Banners Table */}
      <div className="block-Table">
        <StaticTable />
      </div>
    </StaticWrapper>
  );
}

export default StaticPage;