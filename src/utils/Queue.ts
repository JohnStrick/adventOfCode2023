type Node<T> = {
    value: T,
    next: Node<T> | undefined
}

export default function Queue<T>() {
    let head: Node<T> | undefined, tail: Node<T>;
    return Object.freeze({     
        enqueue(value: T) { 
            const link = {value, next: undefined};
            tail = head ? tail.next = link : head = link;
        },
        dequeue() {
            if (head) {
                const value = head.value;
                head = head.next;
                return value;
            }
        },
        peek() { 
            return head?.value 
        }
    });
}