from itertools import permutations

def calculate_path_length (arr, matrix):
        length = 0
        for i in range(len(arr)-1):
            length += matrix[arr[i]][arr[i+1]]
        return length

def two_opt(index_arr, matrix):
    init_length = calculate_path_length(index_arr, matrix)
    improved = True
    while improved:
        improved = False
        for i in range(1, len(index_arr)-2):
            for j in range(i, len(index_arr)):
                if j-i == 1: continue
                new_path = index_arr[:i] + index_arr[i:j+1][::-1] + index_arr[j+1:]
                new_length = calculate_path_length(new_path, matrix)
                if new_length < init_length:
                    index_arr = new_path
                    improved = True
                    init_length = new_length
    return index_arr

def brute(index_arr, matrix):
    init_length = calculate_path_length(index_arr, matrix)
    for permutation in list(permutations(range(1, len(index_arr)))):
        new_path = [0]
        for index in permutation:
            new_path.append(index)
        new_length = calculate_path_length(new_path, matrix)
        if new_length < init_length:
            index_arr = new_path
            init_length = new_length
    return index_arr