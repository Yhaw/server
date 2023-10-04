# Use Ubuntu 18.04 as the base image
FROM ubuntu:18.04

# Set environment variables to prevent interactive prompts during installation
ENV DEBIAN_FRONTEND=noninteractive
ENV SKLEARN_ALLOW_DEPRECATED_SKLEARN_PACKAGE_INSTALL=True

# Update package lists and install necessary packages
RUN apt-get update -y && apt-get install -y \
    wget \
    bzip2 \
    apt-utils \
    git \
    zip \
    build-essential \
    nano \
    libglib2.0-0 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Download and install Miniconda
RUN wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh -O miniconda.sh \
    && /bin/bash miniconda.sh -b -p /opt/conda \
    && rm miniconda.sh

# Set the PATH to include Miniconda
ENV PATH="/opt/conda/bin:$PATH"

# Create a Conda environment with Python 3.6
RUN conda create -n myenv python=3.6

# Activate Conda environment
RUN echo "source activate myenv" > ~/.bashrc
ENV PATH /opt/conda/envs/myenv/bin:$PATH

# Install TensorFlow 1.15.5 using pip within the Conda environment
RUN /bin/bash -c "source activate myenv && pip install tensorflow==1.15.5"

# Install OpenCV 3.4.6.27 for Python 3.6
RUN /bin/bash -c "source activate myenv && pip install opencv-python==3.4.6.27"

# Clone the Git repository
RUN git clone https://github.com/juldtech/juldtechAxelerate.git /app/juldtechAxelerate

# Install the juldtechAxelerate package from its GitHub repository
RUN /bin/bash -c "source activate myenv && pip install git+https://github.com/juldtech/juldtechAxelerate"

# Set the PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION environment variable
ENV PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION=python

# Install libgl1-mesa-glx
RUN apt-get update -y && apt-get install -y libgl1-mesa-glx \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Download the AWS CLI installation package
RUN wget "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -O "awscliv2.zip"

# Unzip the AWS CLI package
RUN unzip awscliv2.zip

# Run the AWS CLI installation script (as root)
RUN ./aws/install

# Clean up the installation package and directory
RUN rm -rf awscliv2.zip ./aws

COPY ./script.sh /app
# Set the working directory to /app
WORKDIR /app

# ... (continue with other instructions)

# Define an entry point to activate Conda environment and start an interactive shell
CMD ["/opt/conda/bin/bash", "-c", "source activate myenv && /bin/bash"]
