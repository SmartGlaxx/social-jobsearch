
import FuzzySearch from 'fuzzy-search'; // Or: var FuzzySearch = require('fuzzy-search');
import { UseAppContext } from '../../Contexts/app-context';


const Search = ()=>{
    const {tempAllUsers} = UseAppContext()

    
// const people = [{
//     name: {
//       firstName: 'Jesse',
//       lastName: 'Bowen',
//     },
//     state: 'Seattle',
//   }];
   
//   const searcher = new FuzzySearch(people, ['name.firstName', 'state'], {
//     caseSensitive: true,
//   });
//   const result = searcher.search('ess');


console.log(tempAllUsers)
}

export default Search