import { mockBreads } from '../mocks/breads';

function BreadList() {
  const [breads, setBreads] = useState(mockBreads); // ← Replace with real API later
  
   useEffect(() => { 
     apiClient.get('/breads').then(res => setBreads(res.data));
   }, []);
}