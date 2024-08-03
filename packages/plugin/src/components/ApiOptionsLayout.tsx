import { useCallback, useContext } from 'react'
import { ApiOptionsContext } from './ApiItem'

export default function ApiOptionsLayout() {
  const { hideInherited, setHideInherited } = useContext(ApiOptionsContext);
  const handleHideInherited = useCallback(() => {
    setHideInherited(!hideInherited);
  }, [hideInherited, setHideInherited]);

  return (
    <>
      <div className="tsd-api-options">
        <div><b>Page Options</b></div>
        <label>
          <input checked={hideInherited} type="checkbox" onChange={handleHideInherited} />
          <span>Hide Inherited</span>
        </label>
      </div>
    </>
  );
}
