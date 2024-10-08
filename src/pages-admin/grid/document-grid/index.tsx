import DocumentUpload from '../../property-documents/index';
// import styles from './document.module.css';


const DocumentGrid: React.FC<{ isSidebarOpen: boolean }> = ({ }) => {
    return (
        <div className="grid grid-cols-1 gap-4">
            {/* <h1 className={styles.title}>Documents</h1> */}
            <DocumentUpload />
        </div>
    );
};
export default DocumentGrid