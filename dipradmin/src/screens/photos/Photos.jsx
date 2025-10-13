
import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { PhotosWrapper } from "./Photos.style";
import PhotosTable from "../../components/photos/photostable";
// import BannersTable from "../../components/banners/BannersTable";

function PhtotosPage() {
  const navigate = useNavigate();

  const handleAddBannerClick = () => {
    navigate("/manage-photos/addphotos"); // Navigate to the new banner creation page
  };

  return (
    <PhotosWrapper>
      <div className="header-section">
        <div className="block-title">Photos</div>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          className="add-article-btn"
          onClick={handleAddBannerClick}
        >
          Add Photos
        </Button>
      </div>

      {/* Banners Table */}
      <div className="block-Table">
        <PhotosTable />
      </div>
    </PhotosWrapper>
  );
}

export default PhtotosPage;