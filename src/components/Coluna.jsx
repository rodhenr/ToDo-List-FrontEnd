import { useState } from "react";

import { useDrop } from "react-dnd";

import { v4 as uuidv4 } from "uuid";

import { useDispatch, useSelector } from "react-redux";
import { addTodo } from "../store/slices/ItensSlice";

function Coluna({ children, className, titulo }) {
  const [newDesc, setNewDesc] = useState("");
  const [open, setOpen] = useState(false);
  const storeItems = useSelector((state) => state.itensReducer.items);
  const dispatch = useDispatch();

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: "item",
    drop: () => ({ nomeColuna: titulo }), // Quando o item é dropado no alvo, esse objeto vira o resultado do getDropResult no end do useDrag
    collect: (monitor) => ({
      // Usado para mudar a cor do background da coluna caso ela esteja sendo o alvo do drag
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const getBackgroundColor = () => {
    if (isOver) {
      if (canDrop) {
        return "#ebebeb";
      }
    } else {
      return "";
    }
  };

  function handleOpen() {
    setOpen(!open);
  }

  function handleChange(e) {
    const value = e.target.value;
    setNewDesc(value);
  }

  function handleNovoItem() {
    if (newDesc !== "") {
      const itemRepetido = storeItems.some((i) => i.desc === newDesc);

      if (!itemRepetido) {
        const newID = uuidv4();
        const newItem = { id: newID, desc: newDesc, coluna: titulo };
        dispatch(addTodo(newItem));
        setNewDesc("");
        setOpen(false);
      } else {
        alert("Item repetido! Digite outra descrição.");
      }
    } else {
      return;
    }
  }

  return (
    <div
      ref={drop}
      className={className}
      style={{ backgroundColor: getBackgroundColor() }}
      data-cy="coluna"
    >
      <div className="coluna-desc">
        <div className="desc">
          <div className="desc-info">
            <span>{titulo}</span>
            <span>|</span>
            <span>{children.length}</span>
          </div>
          <div className="desc-novo">
            <span onClick={handleOpen} data-cy="novo-item">
              {open ? "-" : "+"}
            </span>
          </div>
        </div>
        <div className={open ? "novo-item ativo" : "novo-item"}>
          {open && (
            <>
              <input
                type="text"
                placeholder="Digite aqui"
                value={newDesc}
                onChange={handleChange}
                data-cy="input-add"
              />
              <button onClick={() => handleNovoItem()} data-cy="button-add">
                Add
              </button>
            </>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}

export default Coluna;
